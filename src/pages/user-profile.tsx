import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, Heart, MapPin, Settings, LogOut } from "lucide-react";
import DefaultLayout from "../layout/DefaultLayout";

// Tab components
const ProfileInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* Avatar Section - No border radius */}
      <div className="flex flex-col items-start md:flex-row md:items-start gap-8 pb-8 border-b border-black/10">
        <div className="relative">
          <div className="w-24 h-24 bg-black flex items-center justify-center text-white text-2xl font-normal tracking-wide">
            JD
          </div>
          <button className="absolute bottom-0 right-0 bg-white border border-black/20 p-1.5 hover:bg-black/5 transition">
            <svg
              className="w-4 h-4 text-black/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
        <div>
          <h3 className="text-xl font-normal text-black tracking-wide">
            Jessica Doe
          </h3>
          <p className="text-black/50 text-sm mt-1">jessica.doe@example.com</p>
          <p className="text-xs text-black/30 mt-2">Member since May 2024</p>
        </div>
      </div>

      {/* Form Fields - No border radius */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-2">
            Full Name
          </label>
          <input
            type="text"
            defaultValue="Jessica Doe"
            className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-2">
            Email Address
          </label>
          <input
            type="email"
            defaultValue="jessica.doe@example.com"
            className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            defaultValue="+1 234 567 8900"
            className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            defaultValue="1995-06-15"
            className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-2">
            Bio
          </label>
          <textarea
            rows={3}
            defaultValue="Fashion enthusiast and trend curator. Love exploring sustainable fashion and vintage styles."
            className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button className="px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.15em] hover:bg-black/80 transition">
          Save Changes
        </button>
      </div>
    </motion.div>
  );
};

const OrderHistory = () => {
  const orders = [
    {
      id: "#ORD-001",
      date: "May 5, 2026",
      total: "$245.00",
      status: "Delivered",
      items: 3,
    },
    {
      id: "#ORD-002",
      date: "Apr 28, 2026",
      total: "$129.99",
      status: "Shipped",
      items: 1,
    },
    {
      id: "#ORD-003",
      date: "Apr 15, 2026",
      total: "$89.50",
      status: "Delivered",
      items: 2,
    },
    {
      id: "#ORD-004",
      date: "Apr 2, 2026",
      total: "$399.00",
      status: "Cancelled",
      items: 4,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-green-600";
      case "Shipped":
        return "text-blue-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-black/50";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-black/10 p-5 hover:border-black/30 transition"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-medium text-black tracking-wide">{order.id}</p>
              <p className="text-xs text-black/40 mt-1">{order.date}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xs text-black/60">{order.items} items</span>
              <span className="font-medium text-black">{order.total}</span>
              <span
                className={`text-xs tracking-wide ${getStatusColor(order.status)}`}
              >
                {order.status}
              </span>
              <button className="text-xs uppercase tracking-[0.15em] text-black/60 hover:text-black transition">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

const Wishlist = () => {
  const wishlistItems = [
    {
      id: 1,
      name: "Silk Maxi Dress",
      price: "$189.00",
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Leather Crossbody Bag",
      price: "$79.00",
      image:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "Oversized Blazer",
      price: "$159.00",
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=100&fit=crop",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {wishlistItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-5 border border-black/10 p-4 hover:border-black/30 transition"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 object-cover"
          />
          <div className="flex-1">
            <h4 className="font-medium text-black tracking-wide">
              {item.name}
            </h4>
            <p className="text-black/60 text-sm mt-1">{item.price}</p>
          </div>
          <button className="px-5 py-2 bg-black text-white text-xs uppercase tracking-[0.15em] hover:bg-black/80 transition">
            Add to Cart
          </button>
          <button className="p-2 text-black/30 hover:text-red-500 transition">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      ))}
    </motion.div>
  );
};

const AddressBook = () => {
  const addresses = [
    {
      id: 1,
      name: "Home",
      street: "123 Fashion Avenue",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
      isDefault: true,
    },
    {
      id: 2,
      name: "Work",
      street: "456 Style Boulevard",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
      isDefault: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {addresses.map((address) => (
        <div key={address.id} className="border border-black/10 p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-medium text-black tracking-wide">
                  {address.name}
                </h4>
                {address.isDefault && (
                  <span className="text-[10px] uppercase tracking-[0.15em] text-black/40 border border-black/20 px-2 py-0.5">
                    Default
                  </span>
                )}
              </div>
              <p className="text-black/60 text-sm">{address.street}</p>
              <p className="text-black/60 text-sm">
                {address.city}, {address.state} {address.zip}
              </p>
              <p className="text-black/60 text-sm">{address.country}</p>
            </div>
            <div className="flex gap-4">
              <button className="text-xs uppercase tracking-[0.15em] text-black/50 hover:text-black transition">
                Edit
              </button>
              {!address.isDefault && (
                <button className="text-xs uppercase tracking-[0.15em] text-black/50 hover:text-black transition">
                  Set as Default
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      <button className="w-full py-4 border border-black/20 text-black/60 hover:border-black hover:text-black transition flex items-center justify-center gap-2 text-xs uppercase tracking-[0.15em]">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add New Address
      </button>
    </motion.div>
  );
};

const SettingsTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-sm uppercase tracking-[0.2em] text-black/50 mb-5">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-black/70 text-sm">
              Email notifications for orders
            </span>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 border-black/30 focus:ring-0 focus:ring-offset-0"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-black/70 text-sm">Promotional emails</span>
            <input
              type="checkbox"
              className="w-4 h-4 border-black/30 focus:ring-0 focus:ring-offset-0"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-black/70 text-sm">
              SMS updates for deliveries
            </span>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 border-black/30 focus:ring-0 focus:ring-offset-0"
            />
          </label>
        </div>
      </div>

      <div className="pt-5 border-t border-black/10">
        <h3 className="text-sm uppercase tracking-[0.2em] text-black/50 mb-5">
          Privacy & Security
        </h3>
        <div className="space-y-3">
          <button className="block text-sm text-black/60 hover:text-black transition">
            Change Password
          </button>
          <button className="block text-sm text-red-500/70 hover:text-red-600 transition">
            Delete Account
          </button>
        </div>
      </div>

      <div className="pt-5 border-t border-black/10">
        <button className="flex items-center gap-2 text-sm text-black/50 hover:text-black transition">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.div>
  );
};

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "orders", label: "Orders", icon: <Package className="w-4 h-4" /> },
    { id: "wishlist", label: "Wishlist", icon: <Heart className="w-4 h-4" /> },
    {
      id: "addresses",
      label: "Addresses",
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo />;
      case "orders":
        return <OrderHistory />;
      case "wishlist":
        return <Wishlist />;
      case "addresses":
        return <AddressBook />;
      case "settings":
        return <SettingsTab />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <DefaultLayout>
      {/* Hero Section - Minimalist, no border radius */}
      <div className="relative h-[400px] overflow-hidden bg-black">
        <div className="image-container">
          <img
            src="https://images.unsplash.com/photo-1654967823638-62acf4987dfd?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="w-full absolute object-center inset-0 h-full object-cover opacity-30"
          />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Small label */}
              <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4">
                Welcome Back
              </p>

              {/* Main title */}
              <h1 className="text-4xl md:text-6xl font-light text-white tracking-tight font-['Times_New_Roman',serif] leading-[1.2]">
                Jessica <span className="font-normal italic">Doe</span>
              </h1>

              {/* Divider line */}
              <div className="w-16 h-px bg-white/30 my-6" />

              {/* Description */}
              <p className="text-white/50 text-sm md:text-base max-w-xl leading-relaxed">
                Access your order history, manage your wishlist, update your
                profile, and personalize your shopping experience.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-16">
          {/* Tabs - Clean lines, no rounded corners */}
          <div className="border-b border-black/10">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-[0.15em] transition-all whitespace-nowrap border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? "text-black border-black"
                      : "text-black/40 border-transparent hover:text-black/70 hover:border-black/30"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content - No rounded corners */}
          <div className="pt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UserProfile;
