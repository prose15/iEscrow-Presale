import {
  darkTheme,
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";

import {
  metaMaskWallet,
  walletConnectWallet,
  baseAccount
} from "@rainbow-me/rainbowkit/wallets";

import {
  WagmiProvider,
  createConfig,
} from "wagmi";

import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "wagmi";
import type { PropsWithChildren } from "react";

const queryClient = new QueryClient();

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

// Detect mobile browser
const isMobile =
  typeof navigator !== "undefined" &&
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// ----------------------------
//  FIXED CONNECTOR LIST
// ----------------------------
const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        // Allow WalletConnect only on desktop (NOT mobile MetaMask app)
        ...(isMobile ? [] : [walletConnectWallet]),
        baseAccount,
      ],
    },
  ],
  {
    appName: "iEscrow Presale",
    projectId,
  }
);

// ----------------------------
//  WAGMI CONFIG
// ----------------------------
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(), // REQUIRED
  },
  connectors,
  ssr: false,
});

export default function ProvidersWrapper({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}