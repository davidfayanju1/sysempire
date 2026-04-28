import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    { to: "/about", label: "ABOUT" },
    { to: "/collection", label: "COLLECTION" },
    // { to: "/lookbook", label: "LOOKBOOK" },
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
          fixed top-0 left-0 w-full z-50 border-b border-white/10 transition-all duration-500
          ${isScrolled ? "bg-white shadow-sm py-2 border-b border-gray-100" : "bg-transparent py-4"}
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
              className={`transition-all md:ml-[-1.3rem] duration-300 object-contain ${
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

          {/* Single CTA Button */}
          <motion.button
            onClick={() => navigate("/collection")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              hidden md:flex items-center gap-2 transition-all duration-300 px-5 py-2.5 text-xs font-[400] tracking-wide
              ${
                isScrolled
                  ? "bg-black text-white hover:bg-black/90 shadow-sm"
                  : "bg-white text-black hover:bg-white/90"
              }
            `}
          >
            Shop Now
          </motion.button>

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
                          ${active ? "text-blue-800" : "text-gray-900 hover:text-black"}
                        `}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile CTA Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="flex justify-center pt-8"
              >
                <button
                  onClick={() => {
                    navigate("/collection");
                    closeMenu();
                  }}
                  className="flex items-center gap-2 px-8 py-3 bg-black text-white text-sm font-medium tracking-wide hover:bg-black/90 transition-colors"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

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
