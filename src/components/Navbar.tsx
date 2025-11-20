import CustomConnectButton from "./CustomConnectButton";
import EscrowLogo from "../assets/logo.svg"

const NavBar = () => {
  
  return (<>
    {/* <header className="sticky flex flex-col w-full top-0 px-2 md:px-4 py-2 box-border z-50 bg-[#101010] ">
      <div className="w-full mb-2 flex items-center justify-between">
        <div className="w-fit flex items-center justify-between">
          <img className="mr-2" src={EscrowLogo} alt="escrow logo" height={8} width={30}/>
          <h1 className="text-bg-logo font-semibold">iEscrow</h1>
        </div>
        <CustomConnectButton />
      </div>
      <div className="w-full h-[1px] bg-body-text"></div>
    </header> */}
    <header className="fixed z-[100] top-0 left-0 w-full bg-black shadow-2xl text-text-secondary border-b border-white/20">
      <nav
        className="mx-auto flex container items-center justify-between px-4 py-2 lg:py-4"
        aria-label="Global"
      >
        <div className="flex w-full justify-between items-center">
          <a href="https://www.iescrow.io/">
            <img
              src={EscrowLogo}
              alt="iescrow logo"
              draggable="false"
              loading="eager"
              className="w-20 md:w-24 lg:w-32"
            />
          </a>
          <ul className="hidden lg:flex lg:items-center lg:justify-end lg:gap-x-6 lg:w-full">
            <li>
              <CustomConnectButton />
            </li>
          </ul>
          <div className="flex lg:hidden">
            <CustomConnectButton />
          </div>

          {/* <div className="flex lg:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              id="open-menu-button"
              className="-m-2.5 inline-flex cursor-pointer items-center justify-center rounded-md p-2.5 text-white transition-all duration-300 will-change-transform hover:scale-150"
            >
              <span className="sr-only">Open principal Menu</span>
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                ></path>
              </svg>
            </button>
          </div> */}
        </div>
      </nav>
      {/* <dialog
        ref={dialogRef}
        className="bg-black z-50 h-screen max-h-none w-full max-w-full lg:hidden"
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
      >
        <div className="z-10 p-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="w-full flex justify-between">
                <a href="https://www.iescrow.io/">
                  <img
                    src={EscrowLogo}
                    alt="iescrow logo"
                    loading="eager"
                    draggable="false"
                  />
                </a>

                <button
                  onClick={toggleMenu}
                  type="button"
                  id="close-menu-button"
                  className="-m-2.5 cursor-pointer p-2.5 text-white transition-all duration-300 ease-in will-change-transform hover:scale-150"
                >
                  <span className="sr-only">Close Menu</span>
                  <svg
                    className="size-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <ul className="mt-20 text-text-secondary flex flex-col items-center gap-12">
              <li onClick={closeMenu}>
               <CustomConnectButton />
              </li>
              
            </ul>
          </div>
        </div>
      </dialog> */}
    </header>
    </>
  );
}
 
export default NavBar;