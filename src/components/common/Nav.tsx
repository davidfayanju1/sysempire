import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShoppingBag, Search, X, ChevronRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const dropdownTimeoutRef = useRef<any>(null);
  const navRef = useRef(null);

  const isProductPage = location.pathname.startsWith("/product");
  const isDarkTheme = isScrolled || isProductPage;

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileExpanded(null);
    setIsSearchOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow =
      isMobileMenuOpen || isSearchOpen ? "hidden" : "";
  }, [isMobileMenuOpen, isSearchOpen]);

  const handleMouseEnter = (dropdownName: any) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  const collections = [
    {
      title: "WOMEN",
      items: [
        { name: "Ready-to-Wear", to: "/wears/women-ready-to-wear" },
        { name: "Dresses", to: "/wears/women-dresses" },
        { name: "Separates", to: "/wears/women-separates" },
      ],
    },
    {
      title: "MEN",
      items: [
        { name: "Ready-to-Wear", to: "/wears/men-ready-to-wear" },
        { name: "Tailoring", to: "/wears/men-tailoring" },
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

  const handleNavigation = (to: string) => {
    navigate(to);
  };

  return (
    <>
      <motion.nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
          isScrolled ? "bg-white py-3 shadow-sm" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between relative h-14">
            {/* Logo - Positioned relative on mobile to prevent fuzzing */}
            <Link to="/" className="z-50 shrink-0">
              <img
                src={
                  isDarkTheme || isMobileMenuOpen
                    ? "/images/logo_dark.png"
                    : "/images/logo_light.png"
                }
                alt="MAISON"
                className="w-16 h-10 md:w-20 md:h-14 object-contain transition-all duration-500"
              />
            </Link>

            {/* Desktop Nav - Absolute center */}
            <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 gap-8">
              {mainLinks.map((link) => (
                <div
                  key={link.label}
                  onMouseEnter={() =>
                    link.dropdown && handleMouseEnter(link.dropdown)
                  }
                  onMouseLeave={() => link.dropdown && handleMouseLeave()}
                >
                  <button
                    onClick={() => link.to && handleNavigation(link.to)}
                    className={`text-[10px] tracking-[0.2em] uppercase font-light transition-colors ${
                      isDarkTheme ? "text-gray-800" : "text-white"
                    } ${activeDropdown === link.dropdown ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                  >
                    {link.label}
                  </button>
                </div>
              ))}
            </div>

            {/* Icons & Mobile Toggle */}
            <div className="flex items-center gap-4 md:gap-6 z-50">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={
                  isDarkTheme || isMobileMenuOpen
                    ? "text-gray-800"
                    : "text-white"
                }
              >
                <Search size={18} strokeWidth={1} />
              </button>

              <button
                onClick={() => navigate("/cart")}
                className={`relative ${isDarkTheme || isMobileMenuOpen ? "text-gray-800" : "text-white"}`}
              >
                <ShoppingBag size={18} strokeWidth={1} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[7px] rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                className="lg:hidden flex flex-col gap-1.5 p-1"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <motion.span
                  animate={{
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 7 : 0,
                  }}
                  className={`w-5 h-[1px] ${isMobileMenuOpen || isDarkTheme ? "bg-black" : "bg-white"}`}
                />
                <motion.span
                  animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                  className={`w-5 h-[1px] ${isMobileMenuOpen || isDarkTheme ? "bg-black" : "bg-white"}`}
                />
                <motion.span
                  animate={{
                    rotate: isMobileMenuOpen ? -45 : 0,
                    y: isMobileMenuOpen ? -7 : 0,
                  }}
                  className={`w-5 h-[1px] ${isMobileMenuOpen || isDarkTheme ? "bg-black" : "bg-white"}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Dropdowns */}
        <AnimatePresence>
          {activeDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="hidden lg:block absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl"
              onMouseEnter={() =>
                dropdownTimeoutRef.current &&
                clearTimeout(dropdownTimeoutRef.current)
              }
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-[1600px] mx-auto px-12 py-12">
                {activeDropdown === "collections" && (
                  <div className="grid grid-cols-2 gap-16">
                    {collections.map((col) => (
                      <div key={col.title}>
                        <p className="text-[10px] tracking-widest text-gray-400 mb-6 font-medium">
                          {col.title}
                        </p>
                        <div className="space-y-4">
                          {col.items.map((item) => (
                            <Link
                              key={item.name}
                              to={item.to}
                              className="block text-sm text-gray-600 hover:text-black font-light transition-colors"
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
                  <div className="grid grid-cols-4 gap-6">
                    {occasions.map((occ) => (
                      <Link key={occ.name} to={occ.to} className="group">
                        <div className="aspect-[3/4] overflow-hidden rounded-sm bg-gray-100 mb-3">
                          <img
                            src={occ.image}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            alt=""
                          />
                        </div>
                        <p className="text-[9px] tracking-widest text-gray-800 uppercase font-light text-center">
                          {occ.name}
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[45] lg:hidden flex flex-col"
          >
            <div className="flex-1 overflow-y-auto pt-24 px-6 pb-12">
              <div className="space-y-2">
                {mainLinks.map((link) => (
                  <div key={link.label} className="py-2">
                    <div
                      className="flex items-center justify-between group cursor-pointer"
                      onClick={() =>
                        link.dropdown
                          ? setMobileExpanded(
                              mobileExpanded === link.label ? null : link.label,
                            )
                          : handleNavigation(link.to!)
                      }
                    >
                      <span className="text-2xl font-light tracking-tight text-gray-900 uppercase">
                        {link.label}
                      </span>
                      {link.dropdown && (
                        <motion.div
                          animate={{
                            rotate: mobileExpanded === link.label ? 90 : 0,
                          }}
                          className="text-gray-400"
                        >
                          <ChevronRight size={20} strokeWidth={1} />
                        </motion.div>
                      )}
                    </div>

                    <AnimatePresence>
                      {mobileExpanded === link.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="py-4 pl-4 space-y-6 border-l border-gray-100 mt-2">
                            {link.dropdown === "collections" &&
                              collections.map((col) => (
                                <div key={col.title}>
                                  <p className="text-[9px] tracking-widest text-gray-400 uppercase mb-3">
                                    {col.title}
                                  </p>
                                  <div className="space-y-4">
                                    {col.items.map((item) => (
                                      <button
                                        key={item.name}
                                        onClick={() =>
                                          handleNavigation(item.to)
                                        }
                                        className="block text-lg font-light text-gray-600"
                                      >
                                        {item.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            {link.dropdown === "occasions" && (
                              <div className="grid grid-cols-2 gap-4">
                                {occasions.map((occ) => (
                                  <button
                                    key={occ.name}
                                    onClick={() => handleNavigation(occ.to)}
                                    className="text-left"
                                  >
                                    <div className="aspect-[4/5] bg-gray-100 mb-2 rounded-sm overflow-hidden">
                                      <img
                                        src={occ.image}
                                        className="w-full h-full object-cover"
                                        alt=""
                                      />
                                    </div>
                                    <p className="text-[9px] tracking-widest uppercase font-light">
                                      {occ.name}
                                    </p>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col gap-6">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-3 text-gray-800 uppercase text-[10px] tracking-[0.2em] font-light"
                >
                  <User size={18} strokeWidth={1} /> My Account
                </button>
                <div className="flex gap-6 text-[9px] tracking-widest text-gray-400 uppercase font-light">
                  <Link to="/shipping">Shipping</Link>
                  <Link to="/contact">Contact</Link>
                  <Link to="/terms">Terms</Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar - Full screen overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-[60] pt-12 px-6"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-end mb-12">
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-400 hover:text-black"
                >
                  <X size={28} strokeWidth={1} />
                </button>
              </div>
              <input
                type="text"
                placeholder="SEARCH OUR COLLECTIONS"
                autoFocus
                className="w-full text-2xl md:text-4xl font-light tracking-tight border-b border-gray-200 pb-6 outline-none placeholder:text-gray-200"
              />
              <div className="mt-8 flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {["Dresses", "Suits", "Accessories", "New"].map((tag) => (
                  <button
                    key={tag}
                    className="px-4 py-1.5 border border-gray-100 rounded-full text-[10px] tracking-widest uppercase hover:bg-gray-50"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
