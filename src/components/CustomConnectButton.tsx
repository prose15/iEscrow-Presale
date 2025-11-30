import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const CustomConnectButton = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  // Simple mobile detection
  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const hasInjected = typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined';
  const wcProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
  console.log("wcProjectId", wcProjectId);
  const hasValidWalletConnect = Boolean(wcProjectId && wcProjectId !== '0ec065c36773e587f7055999246c1ffe');

  // Deep-link into MetaMask mobile app to open the dapp directly
  const openMetaMaskDeeplink = () => {
    const dappUrl = typeof window !== 'undefined'
      ? window.location.href.replace(/^https?:\/\//, '')
      : '';
    // Official MetaMask app link deep-link that works across iOS/Android
    window.location.href = `https://metamask.app.link/dapp/${dappUrl}`;
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        const handleConnect = () => {
          if (!isConnecting) {
            setIsConnecting(true);
            // On mobile browsers without injected provider and without WalletConnect configured,
            // deep-link into MetaMask app so the site opens in its in-app browser.
            if (isMobile && !hasInjected && !hasValidWalletConnect) {
              openMetaMaskDeeplink();
            } else {
              openConnectModal();
            }
            // Reset connecting state after a delay to allow for connection attempt
            setTimeout(() => setIsConnecting(false), 2000);
          }
        };

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button 
                    className='px-4 md:px-8 font-bold uppercase py-[4px] md:py-3 font-poppins tracking-tighter text-sm bg-[#1b80a4] hover:bg-[#196986] duration-200 rounded-l-full rounded-r-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed' 
                    onClick={handleConnect} 
                    disabled={isConnecting}
                    type="button">
                      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                );
              }

              // Allow ONLY Ethereum Mainnet
              const allowedChain = Number(import.meta.env.VITE_CHAIN_ID || 1);

              if (connected && chain?.id !== allowedChain) {
                return (
                  <button
                    onClick={() => {
                      if (isMobile && !hasInjected && !hasValidWalletConnect) {
                        openMetaMaskDeeplink();
                      } else {
                        openChainModal();
                      }
                    }}
                    type="button"
                    className="px-3 md:px-8 py-2 font-bold uppercase font-poppins text-sm border border-white text-white
                              rounded-full bg-transparent hover:bg-white hover:text-black 
                              duration-200 cursor-pointer"
                  >
                    Wrong Network — Switch to Ethereum Mainnet
                  </button>
                );
              }

              return (
                <div className='flex sm:flex-row flex-col gap-4 md:gap-x-6 items-center'>
                  <button
                    onClick={() => {
                      if (isMobile && !hasInjected && !hasValidWalletConnect) {
                        openMetaMaskDeeplink();
                      } else {
                        openChainModal();
                      }
                    }}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                    className='px-4 md:px-12 font-bold uppercase py-[4px] md:py-3 font-poppins border-2 border-white text-sm  hover:bg-white hover:text-black duration-200 rounded-l-full rounded-r-full cursor-pointer'
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button 
                    onClick={openAccountModal} 
                    type="button"
                    className='px-4 md:px-8 font-bold uppercase py-[4px] md:py-3 font-poppins tracking-tighter  text-sm border-[1px] border-blue-2 bg-blue-2 hover:bg-blue-hover hover:border-blue-hover duration-200 rounded-l-full rounded-r-full cursor-pointer'
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
 
export default CustomConnectButton;