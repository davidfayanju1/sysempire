import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShoppingBag,
  Search,
  X,
  ChevronRight,
  ChevronDown,
  Trash2,
  Plus,
  Minus,
  Heart,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../../util/useCart";
import { useAuthStore } from "../../store/authStore";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, cartCount, removeFromCart, updateQuantity } = useCart();
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const navigate = useNavigate();

  const dropdownTimeoutRef = useRef<any>(null);
  const navRef = useRef(null);

  const isProductPage = location.pathname.startsWith("/product");
  const isDarkTheme = isScrolled || isProductPage;
  const isKidsPage = location.pathname.startsWith("/little-royals");
  // const kidsAccent = "#c96b82";

  // Helper function to check if a link is active
  const isActiveLink = (to: string) => {
    if (to === "/") {
      return location.pathname === to;
    }
    return location.pathname.startsWith(to);
  };

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
    setIsCartOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow =
      isMobileMenuOpen || isSearchOpen || isCartOpen ? "hidden" : "";
  }, [isMobileMenuOpen, isSearchOpen, isCartOpen]);

  const handleMouseEnter = (dropdownName: any) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId: string, itemName: string) => {
    await removeFromCart(itemId);
    toast.success(`${itemName} removed from cart`);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
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
    {
      title: "KIDS",
      items: [{ name: "Little Royals", to: "/little-royals" }],
    },
  ];

  const occasions = [
    {
      name: "Wedding",
      to: "/wears/wedding",
      image: "/images/female-clothing/wedding-pose.png",
    },
    {
      name: "Dinner",
      to: "/wears/dinner",
      image: "/images/female-clothing/orange.png",
    },
    {
      name: "Lunch",
      to: "/wears/lunch",
      image: "/images/female-clothing/lunch.png",
    },
    {
      name: "Party",
      to: "/wears/party",
      image: "/images/female-clothing/blue.png",
    },
  ];

  const mainLinks = [
    { label: "RTW", to: "/wears/new-arrivals" },
    { label: "COLLECTIONS", dropdown: "collections" },
    { label: "OCCASIONS", dropdown: "occasions" },
    { label: "PERSONAL FIT", to: "/custom-wear" },
  ];

  const handleNavigation = (to: string) => {
    navigate(to);
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
  };

  return (
    <>
      <motion.nav
        ref={navRef}
        className={`fixed top-0 border-b border-white/10 left-0 w-full z-50 transition-all duration-700 ${
          isScrolled ? "bg-white py-3 shadow-sm" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-12">
          <div className="flex items-center justify-between relative h-14">
            {/* Logo - Always visible left */}
            <Link to="/" className="z-50 shrink-0">
              {isKidsPage ? (
                <div className="w-12 h-12 md:ml-0 ml-[-.25rem] md:w-14 md:h-14 rounded-full overflow-hidden ring-1 ring-[#c96b82]/50 transition-all duration-500">
                  <img
                    src="/images/sys_children_logo_mark.png"
                    alt="Little Royals by SYS Empire"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <img
                  src={
                    isDarkTheme || isMobileMenuOpen
                      ? "/images/logo_dark.png"
                      : "/images/logo_light.png"
                  }
                  alt="SYS_EMPIRE_LOGO"
                  className="w-16 h-14 md:ml-0 ml-[-.5rem] md:w-20 md:h-14 object-contain transition-all duration-500"
                />
              )}
            </Link>

            {/* Desktop Nav - Absolute center */}
            <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 gap-8">
              {mainLinks.map((link) => {
                const isActive = link.to ? isActiveLink(link.to) : false;

                return (
                  <div
                    key={link.label}
                    onMouseEnter={() =>
                      link.dropdown && handleMouseEnter(link.dropdown)
                    }
                    onMouseLeave={() => link.dropdown && handleMouseLeave()}
                  >
                    <button
                      onClick={() => link.to && handleNavigation(link.to)}
                      className={`flex cursor-pointer items-center gap-1 text-[10px] tracking-[0.2em] uppercase font-light transition-colors ${
                        isDarkTheme ? "text-gray-800" : "text-white"
                      } ${
                        isActive
                          ? "opacity-100 font-medium"
                          : activeDropdown === link.dropdown
                            ? "opacity-100"
                            : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      {link.label}
                      {link.dropdown && (
                        <motion.div
                          animate={{
                            rotate: activeDropdown === link.dropdown ? 180 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={12} strokeWidth={1.5} />
                        </motion.div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Desktop-only Action Icons */}
            <div className="hidden lg:flex items-center gap-6 z-50">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`${isDarkTheme ? "text-gray-800" : "text-white"} cursor-pointer`}
              >
                <Search size={18} strokeWidth={1} />
              </button>

              <button
                onClick={() => navigate(user ? "/profile" : "/login")}
                className={`${isDarkTheme ? "text-gray-800" : "text-white"} cursor-pointer`}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : user ? (
                  <span
                    className={`text-[10px] font-medium tracking-wider border px-1.5 py-0.5 ${isDarkTheme ? "border-gray-800 text-gray-800" : "border-white text-white"}`}
                  >
                    {`${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()}
                  </span>
                ) : (
                  <User size={18} strokeWidth={1} />
                )}
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative cursor-pointer ${isDarkTheme ? "text-gray-800" : "text-white"}`}
              >
                <ShoppingBag size={18} strokeWidth={1} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[7px] rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile-only Hamburger Button */}
            <button
              className="lg:hidden flex flex-col gap-1.5 p-1 z-50 ml-auto"
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
                  <div className="grid grid-cols-3 gap-16">
                    {collections.map((col) => (
                      <div key={col.title}>
                        <p
                          className={`text-[10px] tracking-[0.2em] mb-6 font-medium ${
                            col.title === "KIDS"
                              ? "text-[#c96b82]"
                              : "text-gray-400"
                          }`}
                        >
                          {col.title}
                        </p>
                        <div className="space-y-4">
                          {col.items.map((item) => (
                            <Link
                              key={item.name}
                              to={item.to}
                              className={`flex items-center gap-1.5 text-sm font-light transition-colors ${
                                col.title === "KIDS"
                                  ? "text-gray-600 hover:text-[#c96b82]"
                                  : "text-gray-600 hover:text-black"
                              }`}
                            >
                              {item.name}
                              {col.title === "KIDS" && (
                                <Heart className="w-3 h-3 text-[#c96b82]/60" />
                              )}
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
                        <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
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
                {mainLinks.map((link) => {
                  const isActive = link.to ? isActiveLink(link.to) : false;

                  return (
                    <div key={link.label} className="py-2">
                      <div
                        className="flex items-center justify-between group cursor-pointer"
                        onClick={() =>
                          link.dropdown
                            ? setMobileExpanded(
                                mobileExpanded === link.label
                                  ? null
                                  : link.label,
                              )
                            : handleNavigation(link.to!)
                        }
                      >
                        <span
                          className={`text-2xl font-light tracking-tight uppercase ${
                            isActive
                              ? "text-black font-medium"
                              : "text-gray-900"
                          }`}
                        >
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

                      {/* Active indicator for mobile */}
                      {isActive && !link.dropdown && (
                        <div className="w-8 h-[1px] bg-black mt-1" />
                      )}

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
                                    <p
                                      className={`text-[9px] tracking-widest uppercase mb-3 ${
                                        col.title === "KIDS"
                                          ? "text-[#c96b82]"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      {col.title}
                                    </p>
                                    <div className="space-y-4">
                                      {col.items.map((item) => (
                                        <button
                                          key={item.name}
                                          onClick={() =>
                                            handleNavigation(item.to)
                                          }
                                          className={`flex items-center gap-1.5 text-lg font-light transition-colors ${
                                            isActiveLink(item.to)
                                              ? col.title === "KIDS"
                                                ? "text-[#c96b82] font-medium"
                                                : "text-black font-medium"
                                              : "text-gray-600"
                                          }`}
                                        >
                                          {item.name}
                                          {col.title === "KIDS" && (
                                            <Heart className="w-3 h-3 text-[#c96b82]/60" />
                                          )}
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
                                      <div className="aspect-[4/5] bg-gray-100 mb-2 overflow-hidden">
                                        <img
                                          src={occ.image}
                                          className="w-full h-full object-cover"
                                          alt=""
                                        />
                                      </div>
                                      <p
                                        className={`text-[9px] tracking-widest uppercase font-light ${
                                          isActiveLink(occ.to)
                                            ? "text-black font-medium"
                                            : ""
                                        }`}
                                      >
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
                  );
                })}
              </div>

              {/* Mobile Profile & Cart actions */}
              <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col gap-6">
                <button
                  onClick={() => handleNavigation("/profile")}
                  className={`flex items-center gap-3 uppercase text-[10px] tracking-[0.2em] font-light ${
                    isActiveLink("/profile")
                      ? "text-black font-medium"
                      : "text-gray-800"
                  }`}
                >
                  <User size={18} strokeWidth={1} /> My Account
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className={`flex items-center gap-3 uppercase text-[10px] tracking-[0.2em] font-light ${
                    isActiveLink("/cart")
                      ? "text-black font-medium"
                      : "text-gray-800"
                  }`}
                >
                  <ShoppingBag size={18} strokeWidth={1} /> Shopping Bag (
                  {cartCount})
                </button>
                <div className="flex gap-6 text-[9px] tracking-widest text-gray-400 uppercase font-light mt-4">
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

      {/* Cart Slider Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
            />

            {/* Cart Slider */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-[60] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-light tracking-wide">
                    Your Cart
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {cartCount} {cartCount === 1 ? "item" : "items"}
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <X size={24} strokeWidth={1} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag
                      size={48}
                      strokeWidth={1}
                      className="text-gray-300 mb-4"
                    />
                    <p className="text-gray-500 font-light">
                      Your cart is empty
                    </p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate("/");
                      }}
                      className="mt-6 px-6 py-2 border border-black text-black text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-4"
                      >
                        {/* Product Image */}
                        <div className="w-20 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-sm tracking-wide">
                                {item.name}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                Size: {item.size} / Color: {item.color}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                SKU: {item.sku}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveItem(item.id, item.name)
                              }
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} strokeWidth={1} />
                            </button>
                          </div>

                          {/* Quantity Controls and Price */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 border border-gray-200">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity - 1,
                                  )
                                }
                                className="px-2 py-1 hover:bg-gray-50 transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity + 1,
                                  )
                                }
                                className="px-2 py-1 hover:bg-gray-50 transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <p className="font-medium text-sm">
                              ₦
                              {(item.price * item.quantity).toLocaleString(
                                "en-NG",
                              )}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-gray-100 p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ₦{getTotalPrice().toLocaleString("en-NG")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-500">
                      Calculated at checkout
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate("/checkout");
                    }}
                    className="w-full bg-black text-white py-3 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate("/product");
                    }}
                    className="w-full border border-gray-300 py-3 text-sm uppercase tracking-wider hover:border-black transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
