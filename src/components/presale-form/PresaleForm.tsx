import { useState, useEffect, useCallback, useMemo } from "react";
import { useAccount, useWalletClient } from "wagmi";
import axios from "axios";
import { BrowserProvider, Contract, JsonRpcProvider, formatUnits, parseEther, parseUnits } from "ethers";

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
const DEFAULT_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 11155111);
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
    const escrowUsd = parseFloat(tokenUsdPrice || "0");
    if (amount > 0 && currencyUsd > 0 && escrowUsd > 0) {
      setTokenAmount(((amount-gasBufferAmount) * currencyUsd) / escrowUsd);
    } else {
      setTokenAmount(0);
    }
  }, [amountInput, selectedCurrencyData, tokenUsdPrice]);

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
    } catch (err) { console.error("Error fetching escrow:", err); } finally { setRefreshingEscrow(false); }
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
        const tokensPerUsd = Number(formatUnits(presaleRateRaw, 18));
        const gasBufferFinal = Number(formatUnits(gasBufferVal, 18));
        if (!Number.isNaN(maxSupply)) setTotalPresaleSupply(maxSupply);
        if (!Number.isNaN(sold)) setTokensSold(sold);
        setCanClaim(Boolean(claimStatus));
        setTokenUsdPrice(tokensPerUsd > 0 ? (1 / tokensPerUsd).toFixed(3) : "0.015");
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
    if (!isConnected || !address) return alert("Please connect your wallet first");
    if (!amount || amount <= 0) return alert("Please enter a valid amount to purchase");
    if (!isVerified) return alert("Please complete verification first");

    // 🚫 NEW: Prevent purchase beyond remaining supply
    if (tokenAmount > remainingTokens) {
      return alert("You have exceeded the maximum number of tokens allowed for purchase.");
    }  
  
    try {
      setLoading(true);
  
      if (!walletClient) throw new Error("Wallet not connected");
  
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();
  
      const isNative = selectedCurrencyData.isNative;
      const paymentToken = isNative ? NATIVE_ADDRESS : selectedCurrencyData.address;
  
  
      // ---- Fetch nonce ----
      const authAddr = import.meta.env.VITE_AUTHORIZER_CONTRACT_ADDRESS;
      if (!authAddr) throw new Error("Authorizer address missing");
  
      const authorizer = new Contract(authAddr, AUTHORIZER_ABI, provider);
      let nonce = await authorizer.getNonce(address);
      nonce = nonce.toString();
  
      // ---- Get Decimals ----
      let decimals = selectedCurrencyData.decimals;
      if (!isNative) {
        try {
          const decContract = new Contract(paymentToken, ERC20_ABI, provider);
          decimals = Number(await decContract.decimals());
        } catch {
          console.warn("⚠️ Failed to fetch decimals. Using fallback:", decimals);
        }
      }
  
      // ---- Request Voucher From API ----
      const apiUrl =
        import.meta.env.VITE_API_URL ||
        "https://iescrow-backend.onrender.com";
  
      const requestPayload = {
        buyer: address,
        beneficiary: address,
        paymentToken,
        usdAmount: String(amount),
        userId: address,
        usernonce: String(nonce),
        decimals: 8,
      };
  
      const { data } = await axios.post(`${apiUrl}/api/presale/voucher`, requestPayload);
      const { voucher, signature } = data;
  
      // ---- Contract Interaction ----
      const presaleContract = new Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, signer);
  
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
  
      if (isNative) {
        const ethAmount = parseEther(amount.toString());
  
        tx = await presaleContract.buyWithNativeVoucher(
          address,
          voucherStruct,
          signature,
          { value: ethAmount }
        );
      } else {

        // const tokenContract = new Contract("0xd9de332c023Dc4372fAE306C3779e0659f0f8F6B", ERC20_ABI, signer);
        const tokenContract = new Contract(paymentToken, ERC20_ABI, signer);
        const tokenAmount = parseUnits(amount.toString(), decimals);
  
        const allowance = await tokenContract.allowance(address, PRESALE_CONTRACT_ADDRESS);
  
        if (allowance < tokenAmount) {
          const approveTx = await tokenContract.approve(PRESALE_CONTRACT_ADDRESS, tokenAmount);
          await approveTx.wait();
        }
  
        tx = await presaleContract.buyWithTokenVoucher(
          paymentToken,
          tokenAmount,
          address,
          voucherStruct,
          signature
        );
      }
  
      // const receipt = await tx.wait();
  
      alert(`Purchase successful! TX: ${tx.hash}`);
      refreshEscrowBalance();
    } catch (err: any) {
      console.error("❌ Buy Error:", err);
      alert(`Failed to buy tokens: ${err.response?.data?.error || err.reason || err.message}`);
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

      <form id="presale-form" className="relative max-w-[720px] py-4 px-4 md:px-6 md:py-8 mb-4 rounded-md border-[1px] border-body-text bg-linear-245 from-black from-50% to-logo-grad-blue/60 overflow-hidden">
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

        <TokenPrice title="You will receive" subtitle={loading ? "Calculating..." : tokenAmount > 0 ? `${tokenAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} $ESCROW` : "—"} />

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