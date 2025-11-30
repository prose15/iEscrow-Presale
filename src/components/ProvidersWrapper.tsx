import {
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";

import {
  metaMaskWallet,
  walletConnectWallet,
  baseAccount,
} from "@rainbow-me/rainbowkit/wallets";

import { WagmiProvider, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

const isMobile =
  typeof navigator !== "undefined" &&
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "0ec065c36773e587f7055999246c1ffe";
console.log(projectId);

// ----------------------------
// RainbowKit v1 wallet groups
// (wallets ARE NOT FUNCTIONS anymore)
// ----------------------------
const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet, // NOT called as a function

        // allow WalletConnect ONLY on desktop
        ...(!isMobile && projectId
          ? [walletConnectWallet]
          : []),

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
// Wagmi config
// ----------------------------
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  connectors,
  ssr: false,
});

// React Query
const queryClient = new QueryClient();

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
