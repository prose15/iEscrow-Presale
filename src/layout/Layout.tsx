import { useEffect, useRef, useState } from "react";
import NavBar from "../components/Navbar";
import "@rainbow-me/rainbowkit/styles.css";
import ProvidersWrapper from "../components/ProvidersWrapper";
import Whitepaper from "../components/Whitepaper";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const [openWhitepaper, setOpenWhitepaper] = useState<boolean>(false);
  const lastScrollPosition = useRef(0);
  const prevOpenWhitepaper = useRef(false);

  useEffect(() => {
    if (prevOpenWhitepaper.current === true && openWhitepaper === false) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    prevOpenWhitepaper.current = openWhitepaper;
  }, [openWhitepaper]);

  const handleOpenWhitepaper = () => {
    lastScrollPosition.current = window.scrollY;
    setOpenWhitepaper(true);
  };

  return (
    <div className="font-sans relative bg-black min-h-screen w-auto text-white">
      <ProvidersWrapper>
        <NavBar handleOpenWhitepaper={handleOpenWhitepaper} />
        {/* <WhitepaperViewer
          open={openWhitepaper}
          onClose={handleCloseWhitepaper}
          pdfUrl={pdfUrl}
        /> */}
        {openWhitepaper ? <Whitepaper setOpenWhitepaper={setOpenWhitepaper} /> : <>{children}</>}
        
      </ProvidersWrapper>
    </div>
  );
}
