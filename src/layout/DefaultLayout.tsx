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
      {/* overflow-x-clip, not -hidden: "hidden" on only one axis forces the
          other axis's computed overflow to "auto" per spec, which silently
          turns this div into position:sticky's scrolling container instead
          of the window — breaking sticky for every descendant (e.g. the
          Custom Wear step trail). "clip" gets the same no-horizontal-scroll
          result without that side effect. */}
      <div className="overflow-x-clip">{children}</div>
      <Footer />
    </>
  );
};

export default DefaultLayout;
