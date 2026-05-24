import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

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

export default SettingsTab;
