import Footer from "../components/common/Footer";
import Nav from "../components/common/Nav";
import type { ReactNode } from "react";

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Nav />
      <div className="overflow-x-hidden">{children}</div>
      <Footer />
    </>
  );
};

export default DefaultLayout;
