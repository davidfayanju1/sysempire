import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import ContactUs from "./pages/contact-us";
import AboutPage from "./pages/about-page";
import Collections from "./pages/collections";
import ScrollToTop from "./lib/ScrollToTop";
import LookBookPage from "./pages/look-book";
import Birthday from "./pages/birthday";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import Cart from "./pages/cart";
import UserProfile from "./pages/user-profile";

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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </>
  );
}

export default App;
