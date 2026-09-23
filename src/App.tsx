import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import ContactUs from "./pages/contact-us";
import AboutPage from "./pages/about-page";
import Collections from "./pages/collections";
import CollectionDetails from "./pages/collection-details";
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
import GlassToaster from "./components/common/GlassToaster";
import Checkout from "./pages/checkout";
import NotFound from "./pages/not-found";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PaymentSuccess from "./pages/payment-success";
import PaymentFailed from "./pages/payment-failure";

function App() {
  return (
    <>
      <ScrollToTop />
      <GlassToaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/collection" element={<Collections />} />
        <Route path="/collection/:slug" element={<CollectionDetails />} />
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
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />
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
