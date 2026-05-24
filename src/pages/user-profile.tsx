import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, Heart, MapPin, Settings, Camera } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import MeasurementTab from "../components/profile-tabs/MeasurementTab";
import OrderHistoryTab from "../components/profile-tabs/OrderHistoryTab";
import ProfileInfoTab from "../components/profile-tabs/ProfileInfoTab";
import WishlistTab from "../components/profile-tabs/WishListTab";
import AddressBookTab from "../components/profile-tabs/AddressBookTab";
import SettingsTab from "../components/profile-tabs/SettingsTab";

const UserProfile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
      id: "measurements",
      label: "Take Measurement",
      icon: <Camera className="w-4 h-4" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  // Load active tab from URL on mount
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const isValidTab = tabs.some((tab) => tab.id === tabParam);
    if (tabParam && isValidTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL with the new tab
    setSearchParams({ tab: tabId });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfoTab />;
      case "orders":
        return <OrderHistoryTab />;
      case "wishlist":
        return <WishlistTab />;
      case "addresses":
        return <AddressBookTab />;
      case "measurements":
        return <MeasurementTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <ProfileInfoTab />;
    }
  };

  return (
    <DefaultLayout>
      {/* Hero Section - Minimalist, no border radius */}
      <div className="relative h-[400px] md:pt-[2rem] pt-[4rem] overflow-hidden bg-black">
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
                  onClick={() => handleTabChange(tab.id)}
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
