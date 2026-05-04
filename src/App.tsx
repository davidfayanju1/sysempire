import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import ContactUs from "./pages/contact-us";
import AboutPage from "./pages/about-page";
import Collections from "./pages/collections";
import ScrollToTop from "./lib/ScrollToTop";
import LookBookPage from "./pages/look-book";
import Birthday from "./pages/birthday";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/collection" element={<Collections />} />
        <Route path="/lookbook" element={<LookBookPage />} />
        <Route path="/birthday" element={<Birthday />} />
      </Routes>
    </>
  );
}

export default App;
