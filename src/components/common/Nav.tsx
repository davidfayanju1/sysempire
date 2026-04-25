import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, Heart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
    { to: "/collection", label: "COLLECTION" },
    { to: "/lookbook", label: "LOOKBOOK" },
    { to: "/about", label: "ABOUT" },
    { to: "/contact", label: "CONTACT" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const commonColor = "text-white";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`
          fixed top-0 left-0 w-full z-50 border-b border-gray-100/10 bg-transparent ition-all duration-500
          ${isScrolled ? "bg-white shadow-sm py-2" : "bg-transparent py-4"}
        `}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="relative z-50" onClick={closeMenu}>
            <motion.img
              src={
                isScrolled ? "/images/logo_dark.png" : "/images/logo_light.png"
              }
              alt="Logo"
              className={`transition-all duration-300 object-contain ${
                isScrolled ? "w-24 h-16" : "w-16 h-16"
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

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`transition-all duration-300 ${isScrolled ? "text-gray-600" : commonColor} hover:text-pink-500`}
            >
              <Search className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`transition-all duration-300 ${isScrolled ? "text-gray-600" : commonColor} hover:text-pink-500`}
            >
              <Heart className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`transition-all duration-300 ${isScrolled ? "text-gray-600" : commonColor} hover:text-pink-500`}
            >
              <User className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <ShoppingBag
                className={`w-4 h-4 transition-all duration-300 ${isScrolled ? "text-gray-600" : commonColor} group-hover:text-pink-500`}
              />
              <span className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-pink-500 text-white text-[8px] font-medium rounded-full flex items-center justify-center">
                0
              </span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden relative z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <X className={`${commonColor} w-5 h-5`} />
            ) : (
              <Menu
                className={`${
                  isScrolled ? "text-gray-600" : commonColor
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
                          ${active ? "text-pink-500" : "text-gray-900 hover:text-pink-500"}
                        `}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile Icons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="flex justify-center gap-8 pt-8 border-t border-gray-100"
              >
                <Search className="w-5 h-5 text-gray-500 hover:text-pink-500 transition-colors cursor-pointer" />
                <Heart className="w-5 h-5 text-gray-500 hover:text-pink-500 transition-colors cursor-pointer" />
                <User className="w-5 h-5 text-gray-500 hover:text-pink-500 transition-colors cursor-pointer" />
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-gray-500 hover:text-pink-500 transition-colors cursor-pointer" />
                  <span className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-pink-500 text-white text-[8px] font-medium rounded-full flex items-center justify-center">
                    0
                  </span>
                </div>
              </motion.div>

              {/* Vogue-inspired tagline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center"
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
