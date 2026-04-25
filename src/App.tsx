import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import ContactUs from "./pages/contact-us";
import AboutPage from "./pages/about-page";
import Collections from "./pages/collections";
import ScrollToTop from "./lib/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/collection" element={<Collections />} />
      </Routes>
    </>
  );
}

export default App;
