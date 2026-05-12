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

  /**
   * THEME LOGIC:
   * isProductPage: Checks if we are on a route starting with /product
   * isDarkTheme: Forces dark text/icons if we are on a product page OR if the user has scrolled.
   * This ensures visibility on product pages while keeping the background transparent.
   */
  const isProductPage = location.pathname.startsWith("/product");
  const isDarkTheme = isScrolled || isProductPage;

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
    }, 200);
  };

  const collections = [
    {
      title: "WOMEN",
      items: [
        { name: "Ready-to-Wear", to: "/wears/women-ready-to-wear" },
        { name: "Dresses", to: "/wears/women-dresses" },
        { name: "Separates", to: "/wears/women-separates" },
        { name: "Outerwear", to: "/wears/women-outerwear" },
        { name: "Accessories", to: "/wears/women-accessories" },
      ],
    },
    {
      title: "MEN",
      items: [
        { name: "Ready-to-Wear", to: "/wears/men-ready-to-wear" },
        { name: "Tailoring", to: "/wears/men-tailoring" },
        { name: "Casual", to: "/wears/men-casual" },
        { name: "Outerwear", to: "/wears/men-outerwear" },
        { name: "Accessories", to: "/wears/men-accessories" },
      ],
    },
  ];

  const occasions = [
    {
      name: "Wedding",
      to: "/wears/wedding",
      image: "/images/apparells/wedding.png",
    },
    {
      name: "Dinner",
      to: "/wears/dinner",
      image: "/images/apparells/attire.png",
    },
    {
      name: "Lunch",
      to: "/wears/lunch",
      image: "/images/apparells/adire_2.png",
    },
    { name: "Party", to: "/wears/party", image: "/images/apparells/adire.png" },
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
      <motion.nav
        ref={navRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`
          fixed top-0 border-b-[.1px] border-white/10 left-0 w-full z-50 transition-all duration-700
          ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.05)] py-3" : "bg-transparent py-5"}
        `}
      >
        <div className="max-w-[1600px] mx-auto px-8 md:px-12">
          <div className="flex items-center justify-between">
            {/* Logo - Switches based on isDarkTheme */}
            <Link
              to="/"
              className="relative z-50 group"
              onMouseEnter={() => setActiveDropdown(null)}
            >
              <motion.img
                src={
                  isDarkTheme
                    ? "/images/full_logo_dark.png"
                    : "/images/full_logo_light.png"
                }
                alt="MAISON"
                className="transition-all md:ml-0 ml-[-1.35rem] duration-500 object-contain w-20 h-14"
                whileHover={{ opacity: 0.7 }}
                transition={{ duration: 0.3 }}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-9">
                {mainLinks.map((link) => (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() =>
                      link.dropdown && handleMouseEnter(link.dropdown)
                    }
                    onMouseLeave={() => link.dropdown && handleMouseLeave()}
                  >
                    <button
                      onClick={() => link.to && handleNavigation(link.to)}
                      className={`
                        text-[10px] font-light tracking-[0.25em] uppercase transition-all duration-500
                        ${isDarkTheme ? "text-gray-800" : "text-white"}
                        ${(link.to && isActive(link.to)) || activeDropdown === link.dropdown ? "opacity-100" : "opacity-70 hover:opacity-100"}
                      `}
                    >
                      {link.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Icons */}
            <div className="hidden lg:flex items-center gap-6">
              {[
                { icon: Search, onClick: () => setIsSearchOpen(true) },
                { icon: User, onClick: () => navigate("/profile") },
                {
                  icon: ShoppingBag,
                  onClick: () => navigate("/cart"),
                  badge: cartCount,
                },
              ].map((item, idx) => (
                <motion.button
                  key={idx}
                  onClick={item.onClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative transition-colors duration-500 ${isDarkTheme ? "text-gray-800 hover:text-black" : "text-white hover:text-white/80"}`}
                >
                  <item.icon className="w-[18px] h-[18px]" strokeWidth={1} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-light rounded-full w-3.5 h-3.5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden flex flex-col gap-1 group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    rotate: isMobileMenuOpen
                      ? i === 0
                        ? 45
                        : i === 2
                          ? -45
                          : 0
                      : 0,
                    y: isMobileMenuOpen ? (i === 0 ? 6 : i === 2 ? -6 : 0) : 0,
                    opacity: isMobileMenuOpen && i === 1 ? 0 : 1,
                  }}
                  className={`w-5 h-[1px] transition-colors duration-500 ${isDarkTheme && !isMobileMenuOpen ? "bg-black" : "bg-white"}`}
                />
              ))}
            </button>
          </div>
        </div>

        {/* Dropdowns */}
        <AnimatePresence>
          {activeDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg"
              onMouseEnter={() => {
                if (dropdownTimeoutRef.current)
                  clearTimeout(dropdownTimeoutRef.current);
              }}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-[1600px] mx-auto px-12 py-12">
                {activeDropdown === "collections" ? (
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
                              onClick={() => setActiveDropdown(null)}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-12">
                    {occasions.map((occasion) => (
                      <Link
                        key={occasion.name}
                        to={occasion.to}
                        className="group"
                        onClick={() => setActiveDropdown(null)}
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
            className="fixed inset-0 bg-white z-[60] flex items-start justify-center pt-32"
          >
            <div className="w-full max-w-3xl px-8">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-12 right-12 text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" strokeWidth={1} />
              </button>
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
            className="fixed inset-0 bg-white z-[60] lg:hidden overflow-y-auto pt-24 px-8"
          >
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-8 right-8"
            >
              <X className="w-5 h-5 text-black" strokeWidth={1} />
            </button>
            <div className="space-y-8">
              {mainLinks.map((link: any) => (
                <div key={link.label}>
                  <button
                    onClick={() =>
                      link.to
                        ? handleNavigation(link.to)
                        : setActiveDropdown(
                            activeDropdown === link.dropdown
                              ? null
                              : link.dropdown,
                          )
                    }
                    className="block text-xl font-light tracking-[0.15em] text-gray-800 w-full text-left"
                  >
                    {link.label}
                  </button>
                  {activeDropdown === link.dropdown && (
                    <div className="pl-4 mt-4 space-y-4">
                      {/* Mobile dropdown logic for collections/occasions would go here */}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
