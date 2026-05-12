import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShoppingBag, Search, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const dropdownTimeoutRef = useRef<any>(null);
  const navRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isSearchOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (dropdownName: any) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200); // 200ms delay before closing
  };

  const collections = [
    {
      title: "WOMEN",
      items: [
        {
          name: "Ready-to-Wear",
          to: "/wears/women-ready-to-wear",
          slug: "women-ready-to-wear",
        },
        { name: "Dresses", to: "/wears/women-dresses", slug: "women-dresses" },
        {
          name: "Separates",
          to: "/wears/women-separates",
          slug: "women-separates",
        },
        {
          name: "Outerwear",
          to: "/wears/women-outerwear",
          slug: "women-outerwear",
        },
        {
          name: "Accessories",
          to: "/wears/women-accessories",
          slug: "women-accessories",
        },
      ],
    },
    {
      title: "MEN",
      items: [
        {
          name: "Ready-to-Wear",
          to: "/wears/men-ready-to-wear",
          slug: "men-ready-to-wear",
        },
        {
          name: "Tailoring",
          to: "/wears/men-tailoring",
          slug: "men-tailoring",
        },
        { name: "Casual", to: "/wears/men-casual", slug: "men-casual" },
        {
          name: "Outerwear",
          to: "/wears/men-outerwear",
          slug: "men-outerwear",
        },
        {
          name: "Accessories",
          to: "/wears/men-accessories",
          slug: "men-accessories",
        },
      ],
    },
  ];

  const occasions = [
    {
      name: "Wedding",
      to: "/wears/wedding",
      slug: "wedding",
      image: "/images/apparells/wedding.png",
    },
    {
      name: "Dinner",
      to: "/wears/dinner",
      slug: "dinner",
      image: "/images/apparells/attire.png",
    },
    {
      name: "Lunch",
      to: "/wears/lunch",
      slug: "lunch",
      image: "/images/apparells/adire_2.png",
    },
    {
      name: "Party",
      to: "/wears/party",
      slug: "party",
      image: "/images/apparells/adire.png",
    },
  ];

  const mainLinks = [
    { label: "NEW ARRIVALS", to: "/wears/new-arrivals" },
    { label: "COLLECTIONS", dropdown: "collections" },
    { label: "OCCASIONS", dropdown: "occasions" },
    { label: "EDITORIAL", to: "/wears/editorial" },
    { label: "ATELIER", to: "/wears/atelier" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (to: string) => {
    navigate(to);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <motion.nav
        ref={navRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`
          fixed top-0 border-b-[.1px] border-white/10 left-0 w-full z-50 transition-all duration-700
          ${
            isScrolled
              ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.05)] py-3"
              : "bg-transparent py-5"
          }
        `}
      >
        <div className="max-w-[1600px] mx-auto px-8 md:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="relative z-50 group"
              onMouseEnter={() => setActiveDropdown(null)}
            >
              <motion.img
                src={
                  isScrolled
                    ? "/images/full_logo_dark.png"
                    : "/images/full_logo_light.png"
                }
                alt="MAISON"
                className={`transition-all md:ml-0 ml-[-1.35rem] duration-500 object-contain ${
                  isScrolled ? "w-20 h-14" : "w-20 h-14"
                }`}
                whileHover={{ opacity: 0.7 }}
                transition={{ duration: 0.3 }}
              />
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-9">
                {mainLinks.map((link) => (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => {
                      if (link.dropdown) {
                        handleMouseEnter(link.dropdown);
                      } else {
                        // If it's a regular link without dropdown, clear any pending close
                        if (dropdownTimeoutRef.current) {
                          clearTimeout(dropdownTimeoutRef.current);
                        }
                      }
                    }}
                    onMouseLeave={() => {
                      if (link.dropdown) {
                        handleMouseLeave();
                      }
                    }}
                  >
                    {link.to ? (
                      <button
                        onClick={() => handleNavigation(link.to)}
                        className={`
                          text-[10px] font-light tracking-[0.25em] uppercase transition-all duration-500
                          ${isScrolled ? "text-gray-800" : "text-white"}
                          ${isActive(link.to) ? "opacity-100" : "opacity-70 hover:opacity-100"}
                        `}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <button
                        className={`
                          text-[10px] font-light tracking-[0.25em] uppercase transition-all duration-500
                          ${isScrolled ? "text-gray-800" : "text-white"}
                          ${activeDropdown === link.dropdown ? "opacity-100" : "opacity-70 hover:opacity-100"}
                        `}
                      >
                        {link.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Icons */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Search */}
              <motion.button
                onClick={() => setIsSearchOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`transition-colors duration-500 ${
                  isScrolled
                    ? "text-gray-800 hover:text-black"
                    : "text-white hover:text-white/80"
                }`}
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={1} />
              </motion.button>

              {/* User */}
              <motion.button
                onClick={() => navigate("/profile")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`transition-colors duration-500 ${
                  isScrolled
                    ? "text-gray-800 hover:text-black"
                    : "text-white hover:text-white/80"
                }`}
              >
                <User className="w-[18px] h-[18px]" strokeWidth={1} />
              </motion.button>

              {/* Cart */}
              <motion.button
                onClick={() => navigate("/cart")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative transition-colors duration-500 ${
                  isScrolled
                    ? "text-gray-800 hover:text-black"
                    : "text-white hover:text-white/80"
                }`}
              >
                <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-light rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden flex flex-col gap-1 group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <motion.span
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 6 : 0,
                }}
                className={`w-5 h-[1px] transition-colors duration-500 ${
                  isScrolled && !isMobileMenuOpen ? "bg-black" : "bg-white"
                }`}
              />
              <motion.span
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                className={`w-5 h-[1px] transition-colors duration-500 ${
                  isScrolled && !isMobileMenuOpen ? "bg-black" : "bg-white"
                }`}
              />
              <motion.span
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -6 : 0,
                }}
                className={`w-5 h-[1px] transition-colors duration-500 ${
                  isScrolled && !isMobileMenuOpen ? "bg-black" : "bg-white"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Desktop Dropdowns */}
        <AnimatePresence>
          {activeDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg"
              onMouseEnter={() => {
                // Cancel the close timeout when mouse enters dropdown
                if (dropdownTimeoutRef.current) {
                  clearTimeout(dropdownTimeoutRef.current);
                  dropdownTimeoutRef.current = null;
                }
              }}
              onMouseLeave={() => {
                // Start timeout to close when mouse leaves dropdown
                handleMouseLeave();
              }}
            >
              <div className="max-w-[1600px] mx-auto px-12 py-12">
                {activeDropdown === "collections" && (
                  <div className="grid grid-cols-2 gap-16">
                    {collections.map((collection) => (
                      <div key={collection.title}>
                        <h3 className="text-[10px] font-medium tracking-[0.25em] text-gray-400 mb-6">
                          {collection.title}
                        </h3>
                        <div className="space-y-4">
                          {collection.items.map((item) => (
                            <Link
                              key={item.name}
                              to={item.to}
                              className="block text-sm text-gray-800 hover:text-black transition-colors font-light"
                              onClick={() => {
                                setActiveDropdown(null);
                                if (dropdownTimeoutRef.current) {
                                  clearTimeout(dropdownTimeoutRef.current);
                                }
                              }}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeDropdown === "occasions" && (
                  <div className="grid grid-cols-4 gap-12">
                    {occasions.map((occasion) => (
                      <Link
                        key={occasion.name}
                        to={occasion.to}
                        className="group"
                        onClick={() => {
                          setActiveDropdown(null);
                          if (dropdownTimeoutRef.current) {
                            clearTimeout(dropdownTimeoutRef.current);
                          }
                        }}
                      >
                        <div className="aspect-[3/4] bg-gray-100 mb-4 overflow-hidden rounded-lg">
                          <motion.img
                            src={occasion.image}
                            alt={occasion.name}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.6 }}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <p className="text-xs text-gray-800 font-light tracking-wide text-center group-hover:text-black transition-colors">
                          {occasion.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-[60] flex items-start justify-center pt-32"
          >
            <div className="w-full max-w-3xl px-8">
              <motion.button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-12 right-12 text-gray-400 hover:text-black transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" strokeWidth={1} />
              </motion.button>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="SEARCH"
                    autoFocus
                    className="w-full text-2xl font-light tracking-[0.15em] border-b border-gray-300 pb-4 outline-none placeholder:text-gray-300 text-gray-800"
                  />
                  <Search
                    className="absolute right-0 bottom-4 text-gray-400"
                    strokeWidth={1}
                  />
                </div>

                <div className="mt-12 space-y-2">
                  <p className="text-[10px] tracking-[0.25em] text-gray-400 mb-4">
                    POPULAR SEARCHES
                  </p>
                  {["Dresses", "Tailoring", "Wedding", "Beach"].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate(`/wears/${term.toLowerCase()}`);
                      }}
                      className="block text-sm text-gray-600 hover:text-black transition-colors font-light"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-[60] lg:hidden overflow-y-auto"
          >
            <div className="pt-24 pb-12 px-8">
              {/* Close Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-8 right-8"
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-black" strokeWidth={1} />
              </motion.button>

              {/* Mobile Logo */}
              <div className="absolute top-5 left-6">
                <img
                  src="/images/logo_dark.png"
                  alt="MAISON"
                  className="w-16 h-12 object-contain"
                />
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-8">
                {/* Main Links */}
                <div className="space-y-6">
                  {mainLinks.map((link: any, index: number) => (
                    <motion.div
                      key={link.label}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {link.to ? (
                        <button
                          onClick={() => handleNavigation(link.to)}
                          className="block text-xl font-light tracking-[0.15em] text-gray-800 w-full text-left"
                        >
                          {link.label}
                        </button>
                      ) : (
                        <div>
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === link.dropdown
                                  ? null
                                  : link.dropdown,
                              )
                            }
                            className="text-xl font-light tracking-[0.15em] text-gray-800 mb-4 w-full text-left"
                          >
                            {link.label}
                          </button>
                          {activeDropdown === link.dropdown &&
                            link.dropdown === "collections" && (
                              <div className="pl-4 space-y-4 mt-2">
                                {collections.map((collection) => (
                                  <div key={collection.title}>
                                    <p className="text-[10px] tracking-[0.25em] text-gray-400 mb-2">
                                      {collection.title}
                                    </p>
                                    <div className="space-y-2">
                                      {collection.items.map((item) => (
                                        <Link
                                          key={item.name}
                                          to={item.to}
                                          onClick={() =>
                                            setIsMobileMenuOpen(false)
                                          }
                                          className="block text-sm text-gray-600 hover:text-black font-light"
                                        >
                                          {item.name}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          {activeDropdown === link.dropdown &&
                            link.dropdown === "occasions" && (
                              <div className="pl-4 space-y-2 mt-2">
                                {occasions.map((occasion) => (
                                  <Link
                                    key={occasion.name}
                                    to={occasion.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-sm text-gray-600 hover:text-black mb-2 font-light"
                                  >
                                    {occasion.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Actions */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-8 border-t border-gray-200 flex gap-8"
                >
                  <button
                    onClick={() => {
                      setIsSearchOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center gap-2"
                  >
                    <Search className="w-5 h-5" strokeWidth={1} />
                    <span className="text-[9px] tracking-[0.2em]">SEARCH</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center gap-2"
                  >
                    <User className="w-5 h-5" strokeWidth={1} />
                    <span className="text-[9px] tracking-[0.2em]">ACCOUNT</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/cart");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center gap-2 relative"
                  >
                    <ShoppingBag className="w-5 h-5" strokeWidth={1} />
                    <span className="text-[9px] tracking-[0.2em]">CART</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </motion.div>
              </div>

              {/* Footer Tagline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-16 text-center"
              >
                <p className="text-[9px] tracking-[0.3em] text-gray-300 uppercase">
                  Timeless Elegance Since 2024
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
