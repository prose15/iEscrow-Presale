import {
  darkTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import {
  metaMaskWallet,
  walletConnectWallet,
  baseAccount
} from "@rainbow-me/rainbowkit/wallets";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const projectId =
  import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "YOUR_PROJECT_ID";

const config = getDefaultConfig({
  appName: "Escrow Presale",
  projectId,
  chains: [mainnet],
  ssr: false,

  // ⭐ CUSTOM WALLET LIST — Rainbow Wallet REMOVED
  wallets: [
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet,
        // Only enable WalletConnect on desktop browsers — not on mobile MetaMask
        ...(typeof window !== "undefined" && !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
          ? [walletConnectWallet]
          : []
        ),
        baseAccount,
      ],
    },
  ],
});

const ProvidersWrapper = ({ children }: PropsWithChildren) => {
  if (projectId === "YOUR_PROJECT_ID" && typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.warn("[WalletConnect] VITE_WALLET_CONNECT_PROJECT_ID is not set. Mobile deep-links via WalletConnect will be unavailable.");
  }
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default ProvidersWrapper;
