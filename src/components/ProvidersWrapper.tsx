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
        walletConnectWallet,
        baseAccount
      ],
    },
  ],
});

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
