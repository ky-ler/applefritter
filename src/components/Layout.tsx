import Head from "next/head";
import type { ReactElement } from "react";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: ReactElement }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full pb-24 md:w-2/5 md:pb-0">
        {children}
      </main>
      <div className="hidden md:block" />
      <div className="hidden md:block" />
    </>
  );
};
export default Layout;
