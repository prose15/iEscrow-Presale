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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

const isMobile =
  typeof navigator !== "undefined" &&
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// ************* FIX STARTS HERE *************

// Build connectors via RainbowKit (no 'chains' option on wallets in v2)
const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        // Allow WalletConnect ONLY on desktop
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

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(), // must use http()
  },
  connectors, // <-- our safe connector list
  ssr: false,
});

// ************* FIX ENDS HERE *************

const ProvidersWrapper = ({ children }: PropsWithChildren) => {
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
