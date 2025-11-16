import React from "react";
import NavBar from "../components/Navbar";
import "@rainbow-me/rainbowkit/styles.css";
import ProvidersWrapper from "../components/ProvidersWrapper";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="relative bg-black min-h-screen w-auto overflow-x-clip text-white">
      <ProvidersWrapper>
        <NavBar />
        {children}
      </ProvidersWrapper>
    </div>
  );
}
