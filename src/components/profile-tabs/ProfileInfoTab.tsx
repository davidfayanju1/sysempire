import { motion } from "framer-motion";

const ProfileInfoTab = () => {
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

export default ProfileInfoTab;
