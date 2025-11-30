import { useState, useEffect, useCallback, useMemo } from "react";
import { useAccount, useWalletClient } from "wagmi";
import axios from "axios";
import { BrowserProvider, Contract, JsonRpcProvider, formatUnits, parseEther, parseUnits, hexlify, isHexString, Signature } from "ethers";

import CurrencyInput from "./CurrencyInput";
import CurrencyRadio from "./CurrencyRadio";
import CurrentBalance from "./CurrentBalance";
import FormTitle from "./FormTitle";
import SupplyStatus from "./SupplyStatus";
import TermsCheckbox from "./TermsCheckbox";
import TokenBalance from "./TokenBalance";
import TokenPrice from "./TokenPrice";
import VerificationScreen from "./VerificationScreen";
import EthLogo from "../../assets/img/currencies/ETH.png";
import WETHLogo from "../../assets/img/currencies/WETH.png";
import WBNBLogo from "../../assets/img/currencies/WBNB.png";
import LINKLogo from "../../assets/img/currencies/LINK.png";
import WBTCLogo from "../../assets/img/currencies/WBTC.png";
import USDCLogo from "../../assets/img/currencies/USDC.png";
import USDTLogo from "../../assets/img/currencies/USDT.png";

const DEFAULT_RPC_URL = import.meta.env.VITE_RPC_URL || "https://ethereum.publicnode.com";
const DEFAULT_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 1);
const PRICE_DECIMALS = 8;
const NATIVE_ADDRESS = "0x0000000000000000000000000000000000000000";

type BaseCurrencyDefinition = {
  name: string;
  symbol: string;
  iconURL: string;
  address: string;
  isNative: boolean;
  defaultDecimals: number;
  fallbackPriceUsd: number;
  defaultActive: boolean;
};

const BASE_CURRENCIES: readonly BaseCurrencyDefinition[] = [
  { name: "Ethereum", symbol: "ETH", iconURL: EthLogo, address: NATIVE_ADDRESS, isNative: true, defaultDecimals: 18, fallbackPriceUsd: 4200, defaultActive: true },
  { name: "Wrapped Ethereum", symbol: "WETH", iconURL: WETHLogo, address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", isNative: false, defaultDecimals: 18, fallbackPriceUsd: 4200, defaultActive: true },
  { name: "Wrapped BNB", symbol: "WBNB", iconURL: WBNBLogo, address: "0x418D75f65a02b3D53B2418FB8E1fe493759c7605", isNative: false, defaultDecimals: 18, fallbackPriceUsd: 1000, defaultActive: true },
  { name: "Chainlink", symbol: "LINK", iconURL: LINKLogo, address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", isNative: false, defaultDecimals: 18, fallbackPriceUsd: 20, defaultActive: true },
  { name: "Wrapped Bitcoin", symbol: "WBTC", iconURL: WBTCLogo, address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", isNative: false, defaultDecimals: 8, fallbackPriceUsd: 45000, defaultActive: true },
  { name: "USD Coin", symbol: "USDC", iconURL: USDCLogo, address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", isNative: false, defaultDecimals: 6, fallbackPriceUsd: 1, defaultActive: true },
  { name: "Tether USD", symbol: "USDT", iconURL: USDTLogo, address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", isNative: false, defaultDecimals: 6, fallbackPriceUsd: 1, defaultActive: true },
] as const;

type TokenMetadata = { priceUsd: number; decimals: number; isActive: boolean };
type TokenPriceStruct = { priceUSD: bigint; isActive: boolean; decimals: number };

const buildFallbackMetadata = (): Record<string, TokenMetadata> => {
  const result: Record<string, TokenMetadata> = {};
  BASE_CURRENCIES.forEach((currency) => {
    result[currency.address.toLowerCase()] = {
      priceUsd: currency.fallbackPriceUsd,
      decimals: currency.defaultDecimals,
      isActive: currency.defaultActive,
    };
  });
  return result;
};

export type Currency = {
  name: string;
  symbol: string;
  iconURL: string;
  address: string;
  isNative: boolean;
  decimals: number;
  priceUsd: number;
  isActive: boolean;
};

const PRESALE_ABI = [
  "function buyWithNativeVoucher(address beneficiary, tuple(address buyer, address beneficiary, address paymentToken, uint256 usdLimit, uint256 nonce, uint256 deadline, address presale) voucher, bytes signature) external payable",
  "function buyWithTokenVoucher(address token, uint256 amount, address beneficiary, tuple(address buyer, address beneficiary, address paymentToken, uint256 usdLimit, uint256 nonce, uint256 deadline, address presale) voucher, bytes signature) external"
];
const TOKEN_PRICE_ABI = ["function getTokenPrice(address token) view returns (uint256 priceUSD,bool isActive,uint8 decimals)"];
const SUPPLY_ABI = ["function totalTokensMinted() view returns (uint256)", "function maxTokensToMint() view returns (uint256)", "function canClaim() view returns (bool)", "function presaleRate() view returns (uint256)", "function gasBuffer() view returns (uint256)"];
const AUTHORIZER_ABI = ["function getNonce(address user) view returns (uint256)"];
const ERC20_ABI = ["function approve(address spender, uint256 amount) external returns (bool)", "function allowance(address owner, address spender) external view returns (uint256)", "function balanceOf(address account) external view returns (uint256)", "function decimals() external view returns (uint8)"];

// Normalize different signature shapes into 0x-prefixed hex string acceptable by ethers (BytesLike)
function normalizeSignature(input: unknown): `0x${string}` {
  // Already a valid 0x hex string
  if (typeof input === "string") {
    const trimmed = input.trim();
    const prefixed = trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`;
    if (isHexString(prefixed)) {
      return prefixed as `0x${string}`;
    }
    // Try to parse base64-encoded signatures (rare, but defensive)
    try {
      // atob may not exist in all envs; fallback safe path
      const b64 = trimmed.replace(/[\r\n\s]/g, "");
      const binary = typeof atob === "function" ? atob(b64) : "";
      if (binary) {
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return hexlify(bytes) as `0x${string}`;
      }
    } catch { /* ignore */ }
  }

  // Node Buffer-esque JSON shape: { type: 'Buffer', data: number[] }
  if (input && typeof input === "object" && "type" in (input as any) && (input as any).type === "Buffer" && Array.isArray((input as any).data)) {
    const arr: number[] = (input as any).data;
    return hexlify(new Uint8Array(arr)) as `0x${string}`;
  }

  // r/s/v shape or anything Signature.from can understand
  try {
    const sig = Signature.from(input as any);
    return sig.serialized as `0x${string}`;
  } catch {
    // fallthrough
  }

  throw new Error("Invalid signature format (expected hex string, Buffer, or r/s/v object).");
}

const PresaleForm = () => {
  const [loading, setLoading] = useState(false);
  // const [verificationStatus, setVerificationStatus] = useState('pending');
  const [selectedCurrency, setSelectedCurrency] = useState('ETH');
  const [amountInput, setAmountInput] = useState("");
  const [userBalance, setUserBalance] = useState("0");
  const [escrowBalance, setEscrowBalance] = useState("0");
  const [refreshingEscrow, setRefreshingEscrow] = useState(false);
  const [tokenMetadata, setTokenMetadata] = useState<Record<string, TokenMetadata>>(() => buildFallbackMetadata());
  const [totalPresaleSupply, setTotalPresaleSupply] = useState<number>(5000000000);
  const [tokensSold, setTokensSold] = useState<number>(0);
  const [canClaim, setCanClaim] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [tokenUsdPrice, setTokenUsdPrice] = useState("0.015");
  const [tokensPerUsd, setTokensPerUsd] = useState<number>(66.67); // Default fallback: 1/0.015 = 66.67 tokens per USD
  const [gasBufferAmount, setGasBufferAmount] = useState<number>(0);
  // const [showCountryModal, setShowCountryModal] = useState(false);
  // const [selectedCountry, setSelectedCountry] = useState<'US' | 'Other'>('Other');
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [showVerificationScreen, setShowVerificationScreen] = useState(false);
  const [isVerified, setIsVerified] = useState(false)
  const [isChecked, setIsChecked] = useState<boolean>(false);




  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const PRESALE_CONTRACT_ADDRESS = import.meta.env.VITE_PRESALE_CONTRACT_ADDRESS || "0x...PRESALE_CONTRACT_ADDRESS";
  const amount = amountInput ? Number(amountInput) : 0;

  const remainingTokens = useMemo(() => {
    return Math.max(totalPresaleSupply - tokensSold, 0);
  }, [totalPresaleSupply, tokensSold]);
  

  const currencyDataList = useMemo<Currency[]>(() =>
    BASE_CURRENCIES.map((base) => {
      const meta = tokenMetadata[base.address.toLowerCase()];
      return {
        name: base.name,
        symbol: base.symbol,
        iconURL: base.iconURL,
        address: base.address,
        isNative: base.isNative,
        decimals: meta?.decimals ?? base.defaultDecimals,
        priceUsd: meta?.priceUsd ?? base.fallbackPriceUsd,
        isActive: meta?.isActive ?? base.defaultActive,
      };
    }),
    [tokenMetadata]
  );

  const selectedCurrencyData = useMemo<Currency>(() => {
    const currency = currencyDataList.find((item) => item.symbol === selectedCurrency);
    return currency ?? currencyDataList[0];
  }, [currencyDataList, selectedCurrency]);

  useEffect(() => {
    if (!selectedCurrencyData?.isActive) {
      const firstActive = currencyDataList.find((currency) => currency.isActive);
      if (firstActive && firstActive.symbol !== selectedCurrency) {
        setSelectedCurrency(firstActive.symbol);
      }
    }
  }, [currencyDataList, selectedCurrencyData, selectedCurrency]);

  useEffect(() => {
    const amount = parseFloat(amountInput || "0");
    const currencyUsd = selectedCurrencyData?.priceUsd || 0;
    
    // Use tokensPerUsd from contract, or fallback to default (66.67 = 1/0.015)
    const effectiveTokensPerUsd = tokensPerUsd > 0 ? tokensPerUsd : 66.67;
    
    // Calculate using tokensPerUsd directly for accuracy
    if (amount > 0 && currencyUsd > 0 && effectiveTokensPerUsd > 0) {
      let effectiveAmount = amount;
      
      // For Ethereum only: subtract estimated gas fee
      // For other tokens: use full amount (gas is paid separately in ETH)
      if (selectedCurrencyData?.isNative && selectedCurrencyData?.symbol === "ETH") {
        // Estimate gas fee: use gasBufferAmount from contract or reasonable default (0.001 ETH)
        const estimatedGasFee = gasBufferAmount > 0 ? gasBufferAmount : 0.001;
        effectiveAmount = Math.max(0, amount - estimatedGasFee);
      }
      
      // Convert effective amount to USD value
      const usdValue = effectiveAmount * currencyUsd;
      // Calculate tokens: USD value * tokens per USD
      const calculatedAmount = usdValue * effectiveTokensPerUsd;
      setTokenAmount(calculatedAmount > 0 ? calculatedAmount : 0);
    } else {
      setTokenAmount(0);
    }
  }, [amountInput, selectedCurrencyData, tokensPerUsd, gasBufferAmount]);

  const getRpcProvider = () => new JsonRpcProvider(DEFAULT_RPC_URL, DEFAULT_CHAIN_ID);

  // CRITICAL: Only upgrade to verified, never downgrade
  const checkVerificationStatus = async (userId: string) => {
    if (!userId || isVerified) return; // Skip if already verified

    try {
      const url = `${import.meta.env.VITE_API_URL || 'https://iescrow-backend.onrender.com'}/api/verify/status/${userId}`;
      const response = await axios.get(url);

      if (response.data.verified === true) {
        setIsVerified(true);
        // setVerificationStatus('verified');
        localStorage.setItem('presale_verified', 'true'); // Persist
      }
    } catch (err: any) {
      console.error("Error checking verification status:", err);
    }
  };

  const fetchUserBalance = useCallback(async (walletAddress: string, currency: Currency) => {
    try {
      const provider = getRpcProvider();
      if (currency.isNative) {
        const balanceWei = await provider.getBalance(walletAddress);
        setUserBalance(parseFloat(formatUnits(balanceWei, currency.decimals)).toFixed(6));
      } else {
        const code = await provider.getCode(currency.address);
        if (!code || code === "0x") { setUserBalance("0.000000"); return; }
        const tokenContract = new Contract(currency.address, ERC20_ABI, provider);
        const balanceRaw = await tokenContract.balanceOf(walletAddress);
        setUserBalance(parseFloat(formatUnits(balanceRaw, currency.decimals)).toFixed(6));
      }
    } catch (err) {
      setUserBalance("0.000000");
    }
  }, []);

  const fetchTokenConfigurations = useCallback(async () => {
    if (!PRESALE_CONTRACT_ADDRESS.includes("...")) {
      try {
        const provider = getRpcProvider();
        const presaleContract = new Contract(PRESALE_CONTRACT_ADDRESS, TOKEN_PRICE_ABI, provider);
        const metadataEntries: Record<string, TokenMetadata> = {};
        await Promise.all(BASE_CURRENCIES.map(async (base) => {
          const key = base.address.toLowerCase();
          let metadata: TokenMetadata = { priceUsd: base.fallbackPriceUsd, decimals: base.defaultDecimals, isActive: base.defaultActive };
          try {
            const result = await presaleContract.getTokenPrice(base.address) as TokenPriceStruct;
            const rawPrice = Number(formatUnits(result.priceUSD, PRICE_DECIMALS));
            metadata = {
              priceUsd: rawPrice > 0 ? rawPrice : base.fallbackPriceUsd,
              decimals: Number(result.decimals) || base.defaultDecimals,
              isActive: Boolean(result.isActive),
            };
          } catch (err) { console.warn(`Could not fetch price for ${base.symbol}:`, err); }
          metadataEntries[key] = metadata;
        }));
        setTokenMetadata(metadataEntries);
      } catch (err) { setTokenMetadata(buildFallbackMetadata()); }
    }
  }, [PRESALE_CONTRACT_ADDRESS]);

  const refreshEscrowBalance = useCallback(async () => {
    if (!address) return;
    try {
      setRefreshingEscrow(true);
      const provider = getRpcProvider();
      const presaleContract = new Contract(PRESALE_CONTRACT_ADDRESS, ["function totalPurchased(address user) view returns (uint256)"], provider);
      const balance = await presaleContract.totalPurchased(address);
      setEscrowBalance(parseFloat(formatUnits(balance, 18)).toFixed(6));
    } catch (err: any) {
      // Silently handle rate limit errors and other RPC issues
      if (err?.code === "BAD_DATA" || err?.code === -32005 || err?.message?.includes("Too Many Requests")) {
        console.warn("Rate limited or RPC error fetching escrow balance, will retry later");
      } else {
        console.error("Error fetching escrow:", err);
      }
    } finally { setRefreshingEscrow(false); }
  }, [address]);

  const fetchSupplyStats = useCallback(async () => {
    if (!PRESALE_CONTRACT_ADDRESS.includes("...")) {
      try {
        const provider = getRpcProvider();
        const presaleContract = new Contract(PRESALE_CONTRACT_ADDRESS, SUPPLY_ABI, provider);
        const [maxTokens, mintedTokens, claimStatus, presaleRateRaw, gasBufferVal] = await Promise.all([
          presaleContract.maxTokensToMint(),
          presaleContract.totalTokensMinted(),
          presaleContract.canClaim(),
          presaleContract.presaleRate(),
          presaleContract.gasBuffer()
        ]);
        const maxSupply = Number(formatUnits(maxTokens, 18));
        const sold = Number(formatUnits(mintedTokens, 18));
        const tokensPerUsdValue = Number(formatUnits(presaleRateRaw, 18));
        const gasBufferFinal = Number(formatUnits(gasBufferVal, 18));
        if (!Number.isNaN(maxSupply)) setTotalPresaleSupply(maxSupply);
        if (!Number.isNaN(sold)) setTokensSold(sold);
        setCanClaim(Boolean(claimStatus));
        setTokensPerUsd(tokensPerUsdValue > 0 ? tokensPerUsdValue : 0);
        setTokenUsdPrice(tokensPerUsdValue > 0 ? (1 / tokensPerUsdValue).toFixed(3) : "0.015");
        setGasBufferAmount(gasBufferFinal);
      } catch (err) { setTokenUsdPrice("0.015"); }
    }
  }, []);

  useEffect(() => { fetchTokenConfigurations(); fetchSupplyStats(); }, [fetchTokenConfigurations, fetchSupplyStats]);

  // Poll only if not verified
  useEffect(() => {
    if (isConnected && address) {
      checkVerificationStatus(address);
      fetchUserBalance(address, selectedCurrencyData);
      refreshEscrowBalance();

      const balanceInt = setInterval(() => {
        fetchUserBalance(address, selectedCurrencyData);
        refreshEscrowBalance();
      }, 120000);

      const verifyInt = setInterval(() => checkVerificationStatus(address), 5000);

      return () => {
        clearInterval(balanceInt);
        clearInterval(verifyInt);
      };
    }
  }, [isConnected, address, selectedCurrencyData, refreshEscrowBalance, fetchUserBalance]);

  // Persist to localStorage
  // useEffect(() => {
  //   localStorage.setItem('presale_verified', String(isVerified));
  // }, [isVerified]);
  useEffect(() => {
    const savedState = localStorage.getItem('presale_verified');
    if (savedState) {
      setIsVerified(JSON.parse(savedState));
    }
  }, []);

  const startVerification = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'https://iescrow-backend.onrender.com'}/api/verify/start`, {
        userId: address,
        email: "user@example.com",
        phone: "+1234567890",
      });
      setShowVerificationScreen(true);
    } catch (err: any) {
      alert(`Failed to start verification: ${err.message}`);
    }
  };

  const handleVerifyClick = async () => {
    if (!isConnected) return alert("Please connect wallet");
    await startVerification();
  };  

  // const handleCountryConfirm = async () => {
  //   setShowCountryModal(false);
  //   await startVerification();
  // };

  const handleBuyTokens = async () => {
    try {
      console.log("added in provided to check");
  
      if (!isConnected || !address)
        return alert("Please connect your wallet first");
  
      if (!amount || amount <= 0)
        return alert("Please enter a valid amount");
  
      if (!isVerified)
        return alert("Please complete verification first");
  
      if (tokenAmount > remainingTokens)
        return alert("You exceeded max token purchase limit");
  
      setLoading(true);
  
      // -------- WALLET CLIENT CHECK --------
      if (!walletClient)
        throw new Error("Wallet not connected");
  
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
  
      const isNative = selectedCurrencyData.isNative;
      const paymentToken = isNative
        ? NATIVE_ADDRESS
        : selectedCurrencyData.address;
  
      // -------- FETCH NONCE --------
      const authAddr = import.meta.env.VITE_AUTHORIZER_CONTRACT_ADDRESS;
      if (!authAddr) throw new Error("Authorizer address missing");
  
      const authorizer = new Contract(authAddr, AUTHORIZER_ABI, provider);
      const nonce = (await authorizer.getNonce(address)).toString();
  
      // -------- FETCH DECIMALS --------
      let decimals = selectedCurrencyData.decimals;
      if (!isNative) {
        try {
          const decContract = new Contract(paymentToken, ERC20_ABI, provider);
          decimals = Number(await decContract.decimals());
        } catch {
          console.warn("⚠ Decimals fetch failed. Using default:", decimals);
        }
      }
  
      // -------- PREPARE VOUCHER REQUEST --------
      const apiUrl =
        import.meta.env.VITE_API_URL ||
        "https://iescrow-backend.onrender.com";
  
      // Backend expects 8 decimals on major tokens
      const force8 =
        ["USDT", "USDC", "WBTC", "ETH"].includes(selectedCurrencyData.symbol);
      const apiDecimals = force8 ? 8 : decimals;
  
      // USD calculation
      let usdAmountForVoucher;
      if (isNative && selectedCurrencyData.symbol === "ETH") {
        const effective = Math.max(
          0,
          amount - (gasBufferAmount > 0 ? gasBufferAmount : 0.0005)
        );
        usdAmountForVoucher = effective * selectedCurrencyData.priceUsd;
      } else {
        usdAmountForVoucher = amount * selectedCurrencyData.priceUsd;
      }
  
      const payload = {
        buyer: address,
        beneficiary: address,
        paymentToken,
        usdAmount: String(usdAmountForVoucher),
        userId: address,
        usernonce: nonce,
        decimals: apiDecimals,
      };
  
      const { data } = await axios.post(`${apiUrl}/api/presale/voucher`, payload);
      const { voucher, signature } = data;
  
      // -------- NORMALIZE SIGNATURE --------
      let sigHex: `0x${string}`;
      try {
        sigHex = Signature.from(signature).serialized as `0x${string}`;
      } catch {
        sigHex = normalizeSignature(signature);
      }
  
      // -------- PREPARE CONTRACT CALL --------
      const presale = new Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, signer);
  
      const voucherStruct = [
        voucher.buyer,
        voucher.beneficiary,
        voucher.paymentToken,
        voucher.usdLimit,
        voucher.nonce,
        voucher.deadline,
        voucher.presale,
      ];
  
      let tx;
  
      // ============================================================
      //                    NATIVE TOKEN BLOCK (ETH)
      // ============================================================
      if (isNative) {
        const ethAmount = parseEther(amount.toString());
  
        const balance = await provider.getBalance(address);
        if (balance < ethAmount)
          throw new Error(`Insufficient ETH balance.`);
  
        // Populate transaction
        const populated = await presale.buyWithNativeVoucher.populateTransaction(
          address,
          voucherStruct,
          sigHex,
          { value: ethAmount }
        );
  
        // Estimate gas safely
        let gasLimit: bigint = 300000n;
        try {
          const est = await provider.estimateGas({
            to: populated.to,
            from: address,
            data: populated.data,
            value: ethAmount,
          });
          gasLimit = (est * 120n) / 100n;
          if (gasLimit > 500000n) gasLimit = 500000n;
        } catch (e) {
          console.warn("Gas estimation failed, using default:", e);
        }
  
        // Mobile MetaMask fix → data must be hex string
        const rawData = populated.data as any;
        const dataHex = hexlify(rawData) as `0x${string}`;
  
        const txHash = await walletClient.sendTransaction({
          to: populated.to! as `0x${string}`,
          data: dataHex,
          value: ethAmount, // MUST be bigint
          gas: gasLimit, // MUST be bigint
        });
  
        tx = {
          hash: txHash,
          wait: async () => {
            let receipt;
            while (!receipt) {
              receipt = await provider.getTransactionReceipt(txHash);
              await new Promise(r => setTimeout(r, 1000));
            }
            return receipt;
          },
        };
      }
  
      // ============================================================
      //                     ERC20 TOKEN BLOCK
      // ============================================================
      else {
        const tokenContract = new Contract(paymentToken, ERC20_ABI, signer);
        const tokenAmount = parseUnits(amount.toString(), decimals);
  
        const allowance = await tokenContract.allowance(
          address,
          PRESALE_CONTRACT_ADDRESS
        );
  
        if (allowance < tokenAmount) {
          const approveTx = await tokenContract.approve(
            PRESALE_CONTRACT_ADDRESS,
            tokenAmount
          );
          await approveTx.wait();
        }
  
        tx = await presale.buyWithTokenVoucher(
          paymentToken,
          tokenAmount,
          address,
          voucherStruct,
          sigHex
        );
      }
  
      // SUCCESS
      alert(`Purchase successful! TX: ${tx.hash}`);
      refreshEscrowBalance();
    } catch (err: any) {
      console.error("❌ Buy Error:", err);
  
      let msg = err?.response?.data?.error
        || err.reason
        || err.shortMessage
        || err.message
        || "Transaction failed";
  
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimTokens = async () => {
    if (!isConnected || !address || !canClaim || !walletClient) return alert("Cannot claim");
    try {
      setClaiming(true);
      const browserProvider = new BrowserProvider(walletClient);
      const signer = await browserProvider.getSigner();
      const presaleContract = new Contract(PRESALE_CONTRACT_ADDRESS, ["function claimTokens() external"], signer);
      const tx = await presaleContract.claimTokens();
      await tx.wait();
      alert("Claimed!");
      await refreshEscrowBalance();
      await fetchSupplyStats();
    } catch (err: any) {
      alert(err.reason || err.message);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <>
      {showVerificationScreen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <VerificationScreen
            userId={address ?? ""}
            // countryCode={selectedCountry}
            onClose={() => {
              setShowVerificationScreen(false);
              if (address) {
                setTimeout(() => checkVerificationStatus(address), 1000);
                setTimeout(() => checkVerificationStatus(address), 5000);
                setTimeout(() => checkVerificationStatus(address), 10000);
              }
            }}
            onVerified={() => {
              setIsVerified(true);
              // setVerificationStatus('verified');
              localStorage.setItem('presale_verified', 'true');
              setShowVerificationScreen(false);
            }}
          />
        </div>
      )}

      <form id="presale-form" className="relative max-w-[720px] py-4 px-4 md:px-6 md:py-8 mb-4 rounded-md border-[1px] border-body-text bg-linear-245 from-black from-50% to-logo-grad-blue/60 overflow-hidden max-lg:mt-7">
        <FormTitle />
        <TokenPrice title="1 $ESCROW" subtitle={`$${tokenUsdPrice}`} />
        <SupplyStatus presaleSupply={totalPresaleSupply} tokensSold={tokensSold} />
        <div className="w-full h-[1px] my-4 bg-body-text rounded-full"></div>

        <h2 className="text-bg-logo font-semibold text-sm md:text-base">You deposit</h2>
        <div className="md:mb-2 mb-1 mt-2 mx-auto flex items-center justify-center flex-wrap md:gap-2 gap-1">
          {currencyDataList.slice(0, 4).map((currency) => (
            <CurrencyRadio key={currency.symbol} symbol={currency.symbol} iconURL={currency.iconURL} checked={selectedCurrency === currency.symbol} disabled={!currency.isActive} onSelect={() => setSelectedCurrency(currency.symbol)} />
          ))}
        </div>
        <div className="mb-3 mx-auto flex items-center justify-center flex-wrap md:gap-2 gap-1">
          <div className="flex-[0.5_1_0]"></div>
          {currencyDataList.slice(4, 7).map((currency) => (
            <CurrencyRadio key={currency.symbol} symbol={currency.symbol} iconURL={currency.iconURL} checked={selectedCurrency === currency.symbol} disabled={!currency.isActive} onSelect={() => setSelectedCurrency(currency.symbol)} />
          ))}
          <div className="flex-[0.5_1_0]"></div>
        </div>

        <CurrentBalance currentBalance={userBalance} currency={{ iconURL: selectedCurrencyData.iconURL, symbol: selectedCurrencyData.symbol }} />
        <CurrencyInput currencyBalance={userBalance} currencyIconURL={selectedCurrencyData.iconURL} currencySymbol={selectedCurrency} usdValue={selectedCurrencyData.priceUsd} value={amountInput} onChange={setAmountInput} />

        <TokenPrice 
          title="You will receive" 
          subtitle={
            amountInput && parseFloat(amountInput) > 0
              ? selectedCurrencyData?.priceUsd > 0
                ? tokenAmount > 0 
                  ? `${tokenAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} $ESCROW`
                  : "0 $ESCROW"
                : "Calculating..."
              : "—"
          } 
        />

        <TokenBalance balance={escrowBalance} loading={refreshingEscrow} onRefresh={refreshEscrowBalance} canClaim={canClaim} claiming={claiming} onClaim={handleClaimTokens} />

        {isConnected && !isVerified && (
          <button
            type="button"
            onClick={tokenAmount > remainingTokens ? undefined : handleVerifyClick}
            disabled={loading || tokenAmount > remainingTokens}
            className={`w-full py-3 md:py-4 mt-4 font-medium border text-sm md:text-base tracking-tight rounded-full duration-200
              ${
                tokenAmount > remainingTokens
                  ? 'border-red-600 text-red-600 opacity-60 cursor-not-allowed'
                  : loading
                  ? 'border-bg-logo text-bg-logo cursor-wait opacity-70'
                  : 'border-bg-logo text-bg-logo hover:text-black hover:border-bg-logo hover:bg-bg-logo cursor-pointer'
              }
            `}
          >
            {tokenAmount > remainingTokens
              ? "You have exceeded the max tokens available"
              : loading
              ? "Launching verification..."
              : "Verify to enable purchases"}
          </button>
        )}



       {isVerified && (
  <button
    type="button"
    disabled={
      !isConnected ||
      loading ||
      !selectedCurrencyData.isActive ||
      tokenAmount > remainingTokens ||
      !isChecked
    }
    onClick={() =>
      !isConnected || loading || !isChecked
        ? null
        : handleBuyTokens()
    }
    className={`w-full py-3 md:py-4 mt-3 font-medium border text-sm md:text-base tracking-tight rounded-full duration-200
      disabled:cursor-not-allowed
      ${
        !isChecked
          ? 'border-green-500 text-green-500 opacity-60'
          : tokenAmount > remainingTokens
          ? 'border-red-600 text-red-600 hover:bg-red-600 hover:text-black'
          : !isConnected
          ? 'border-body-text text-body-text'
          : loading
          ? 'border-green-500 text-green-500 cursor-wait opacity-70'
          : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black cursor-pointer'
      }`}
  >
    {!isChecked && amount <= 0
      ? "Enter amount"
      : !isChecked
      ? `Buy with ${selectedCurrencyData.symbol}`
      : !isConnected
      ? "Connect wallet"
      : amount <= 0
      ? "Enter amount"
      : tokenAmount > remainingTokens
      ? "You have exceeded the max tokens available"
      : loading
      ? "Processing..."
      : `Buy with ${selectedCurrencyData.symbol}`
    }
  </button>
)}


        {/* {showCountryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white text-black w-[90%] max-w-sm rounded-lg p-4 shadow-xl">
              <h3 className="text-lg font-semibold mb-3">Select your country</h3>
              <select className="w-full border rounded-md p-2 mb-4" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value === 'US' ? 'US' : 'Other')}>
                <option value="US">United States</option>
                <option value="Other">Other</option>
              </select>
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 rounded-md border" onClick={() => setShowCountryModal(false)}>Cancel</button>
                <button type="button" className="px-4 py-2 rounded-md border border-bg-logo text-bg-logo hover:bg-bg-logo hover:text-black" onClick={handleCountryConfirm}>Continue</button>
              </div>
            </div>
          </div>
        )} */}

        {isVerified && (
  <TermsCheckbox 
    isChecked={isChecked}
    setIsChecked={setIsChecked}
  />
)}

        <img id="bg-form" src="/img/form-bg.jpg" className="absolute opacity-15 w-full h-full inset-0 -z-50" alt="" />
      </form>
    </>
  );
};

export default PresaleForm;