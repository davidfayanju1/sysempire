import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, UserCircle, ShoppingBag } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in (check localStorage or your auth state)
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);

    // Load wishlist and cart counts
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setWishlistCount(wishlist.length);
    setCartCount(cart.length);
  }, []);

  // Listen for storage events to update counts across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setWishlistCount(wishlist.length);
      setCartCount(cart.length);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { to: "/", label: "HOME" },
    { to: "/about", label: "ABOUT" },
    { to: "/collection", label: "COLLECTION" },
    { to: "/contact", label: "CONTACT" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const commonColor = "text-white";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`
          fixed top-0 left-0 w-full z-50 border-b border-white/10 transition-all duration-500
          ${isScrolled ? "bg-white shadow-sm py-2 border-b border-gray-100" : "bg-transparent py-4"}
        `}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="relative z-50 md:ml-0 ml-[-1.7rem]"
            onClick={closeMenu}
          >
            <motion.img
              src={
                isScrolled ? "/images/logo_dark.png" : "/images/logo_light.png"
              }
              alt="Logo"
              className={`transition-all md:ml-[-1.3rem] duration-300 object-contain ${
                isScrolled ? "w-24 h-16" : "w-24 h-16"
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
          </Link>

          {/* Desktop Navigation Links - Centered */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-10">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`
                      relative text-[11px] font-light tracking-[0.2em] uppercase transition-all duration-300
                      ${isScrolled ? "text-gray-800" : commonColor}
                      ${active ? "opacity-100" : "opacity-70 hover:opacity-100"}
                    `}
                  >
                    {link.label}
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-1 left-0 right-0 h-[1px] bg-current"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side icons: Wishlist, User, Cart */}
          <div className="hidden justify-center md:flex items-start gap-5">
            {/* User Icon with Dropdown */}
            <div className="relative">
              {isLoggedIn ? (
                <>
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`transition-colors duration-300 ${
                      isScrolled
                        ? "text-gray-700 hover:text-black"
                        : "text-white hover:text-white/80"
                    }`}
                  >
                    <UserCircle className="w-5 h-5" />
                  </motion.button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-40"
                          onClick={() => setIsUserMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100"
                        >
                          <Link
                            to="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            My Profile
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            My Orders
                          </Link>
                          <Link
                            to="/wishlist"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Wishlist
                          </Link>
                          <hr className="my-1" />
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            <LogOut className="w-3 h-3" />
                            Logout
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <motion.button
                  onClick={() => navigate("/login")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`transition-colors duration-300 ${
                    isScrolled
                      ? "text-gray-700 hover:text-black"
                      : "text-white hover:text-white/80"
                  }`}
                >
                  <User className="w-5 h-5" />
                </motion.button>
              )}
            </div>

            {/* Cart Icon */}
            <motion.button
              onClick={() => navigate("/cart")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:text-black"
                  : "text-white hover:text-white/80"
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden relative z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <X
                className={`${commonColor} w-5 h-5 ${isScrolled ? "text-gray-800" : ""}`}
              />
            ) : (
              <Menu
                className={`${
                  isScrolled ? "text-gray-800" : commonColor
                } w-5 h-5`}
              />
            )}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay - Vogue inspired */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-white md:hidden"
          >
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={closeMenu} />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative flex flex-col h-full pt-20 pb-8 px-6 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Top Right */}
              <button
                onClick={closeMenu}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-black" />
              </button>

              {/* Mobile Logo */}
              <div className="absolute top-5 left-6">
                <img
                  src="/images/logo_dark.png"
                  alt="Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col items-center justify-center flex-1 space-y-8">
                {navLinks.map((link, index) => {
                  const active = isActive(link.to);
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.08, duration: 0.4 }}
                    >
                      <Link
                        to={link.to}
                        onClick={closeMenu}
                        className={`
                          block text-2xl font-light tracking-[0.15em] uppercase transition-colors
                          ${active ? "text-black" : "text-gray-900 hover:text-black"}
                        `}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Mobile Action Icons Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex items-center justify-center gap-8 pt-4"
                >
                  {/* User */}
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="flex flex-col items-center gap-1"
                    >
                      <LogOut className="w-5 h-5 text-gray-700" />
                      <span className="text-[10px] tracking-wide text-gray-500">
                        LOGOUT
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        navigate("/login");
                        closeMenu();
                      }}
                      className="flex flex-col items-center gap-1"
                    >
                      <User className="w-5 h-5 text-gray-700" />
                      <span className="text-[10px] tracking-wide text-gray-500">
                        ACCOUNT
                      </span>
                    </button>
                  )}

                  {/* Cart */}
                  <button
                    onClick={() => {
                      navigate("/cart");
                      closeMenu();
                    }}
                    className="relative flex flex-col items-center gap-1"
                  >
                    <ShoppingBag className="w-5 h-5 text-gray-700" />
                    <span className="text-[10px] tracking-wide text-gray-500">
                      CART
                    </span>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </motion.div>

                {/* Mobile Profile Links for Logged In Users */}
                {isLoggedIn && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="flex flex-col items-center gap-3 pt-2"
                  >
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="text-xs font-light tracking-[0.15em] text-gray-500 hover:text-black transition-colors"
                    >
                      MY PROFILE
                    </Link>
                    <Link
                      to="/orders"
                      onClick={closeMenu}
                      className="text-xs font-light tracking-[0.15em] text-gray-500 hover:text-black transition-colors"
                    >
                      MY ORDERS
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Vogue-inspired tagline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
              >
                <p className="text-[9px] tracking-[0.3em] text-gray-400 uppercase">
                  WHERE STYLE MEETS SOPHISTICATION
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
