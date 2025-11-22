import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const CustomConnectButton = () => {
  const [isConnecting, setIsConnecting] = useState(false);

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
            openConnectModal();
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
              const allowedChain = 1;

              if (connected && chain?.id !== allowedChain) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="px-3 md:px-8 font-bold uppercase font-poppins text-sm border border-red-500 text-red-500
                              rounded-full bg-transparent hover:bg-red-500 hover:text-black 
                              duration-200 cursor-pointer"
                  >
                    Wrong Network — Switch to Ethereum Mainnet
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                    className='px-4 md:px-8 font-bold uppercase py-[4px] md:py-3 font-poppins tracking-tighter text-sm border-blue-2 bg-blue-2 hover:bg-blue-hover hover:border-blue-hover duration-200 rounded-l-full rounded-r-full cursor-pointer'
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