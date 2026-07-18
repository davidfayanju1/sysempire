import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import ContactUs from "./pages/contact-us";
import AboutPage from "./pages/about-page";
import Collections from "./pages/collections";
import LittleRoyalsPage from "./pages/little-royals";
import ScrollToTop from "./lib/ScrollToTop";
import LookBookPage from "./pages/look-book";
import Birthday from "./pages/birthday";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import ForgotPassword from "./pages/auth/forgot-password";
import ResetPassword from "./pages/auth/reset-password";
import VerifyEmail from "./pages/auth/verify-email";
import Cart from "./pages/cart";
import UserProfile from "./pages/user-profile";
import Wears from "./pages/wears";
import ProductDetails from "./pages/product-details";
import CustomWear from "./pages/custom-wear";
import WeAreBack from "./pages/we-are-back";
import OrderConfirmation from "./pages/order-confirmation";
import PrivacyPolicy from "./pages/privacy-policy";
import TermsOfUse from "./pages/terms-of-use";
import { Toaster } from "sonner";
import Checkout from "./pages/checkout";
import NotFound from "./pages/not-found";

function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster
        theme="dark"
        position="bottom-right"
        richColors
        toastOptions={{
          duration: 4000,
          style: {
            background: "black",
            color: "white",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "0px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "300",
            letterSpacing: "0.1em",
            fontSize: "11px",
          },
          classNames: {
            toast:
              "!bg-black !text-white !border-white/10 !rounded-none ![font-weight:300] !tracking-[0.1em] !text-[11px] ![font-family:'Inter',sans-serif]",
            description: "!text-white/60 ![font-weight:300]",
            actionButton:
              "!bg-white !text-black !rounded-none ![font-weight:300]",
            cancelButton:
              "!bg-black !text-white !rounded-none !border-white/20 ![font-weight:300]",
            success: "!bg-green-900 !border-green-700 !text-white",
            error: "!bg-red-900 !border-red-700 !text-white",
            warning: "!bg-amber-900 !border-amber-700 !text-white",
            info: "!bg-blue-900 !border-blue-700 !text-white",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/collection" element={<Collections />} />
        <Route path="/little-royals" element={<LittleRoyalsPage />} />
        <Route path="/lookbook" element={<LookBookPage />} />
        <Route path="/birthday" element={<Birthday />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/wears/:name" element={<Wears />} />
        <Route path="/custom-wear" element={<CustomWear />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/we-are-back" element={<WeAreBack />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />
      </Routes>
    </>
  );
}

export default App;
