import DefaultLayout from "../layout/DefaultLayout";
import { motion } from "framer-motion";
import { Sparkles, Heart, Star, Feather, Music } from "lucide-react";

const Birthday = () => {
  return (
    <DefaultLayout>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        {/* Single Flier Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-2xl w-full bg-white border border-black/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Decorative Border Frame */}
          <div className="absolute inset-3 border border-black/10 rounded-2xl pointer-events-none z-20" />

          {/* Inner Content */}
          <div className="relative p-8 md:p-10">
            {/* Top Decorative Elements */}
            <div className="flex justify-center gap-2 mb-2">
              {/* <div className="w-8 h-px bg-black/20 mt-4" /> */}
              <img
                src="/images/logo_dark.png"
                alt=""
                className="h-20 mt-[-1rem]"
              />
              {/* <div className="w-8 h-px bg-black/20 mt-4" /> */}
            </div>

            {/* Celebration Badge */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 border border-black/10 rounded-full">
                <Sparkles className="w-2.5 h-2.5 text-black/60" />
                <span className="text-[9px] tracking-[0.15em] uppercase text-black/60 font-medium">
                  Happy Post-Humous Birthday
                </span>
                <Sparkles className="w-2.5 h-2.5 text-black/60" />
              </div>
            </div>

            {/* Name */}
            <h1 className="text-5xl md:text-4xl font-light text-center text-black mb-2 tracking-wide font-['Times_New_Roman',serif]">
              Mrs. Adesewa Oluwayanju
            </h1>

            {/* Subtitle */}
            <p className="text-center text-black/50 text-[10px] tracking-[0.2em] uppercase mb-6">
              A Celebration of Light & Legacy
            </p>

            {/* Hero Image - Black & White Treatment */}
            <div className="relative max-w-xs mx-auto mb-6">
              <div className="absolute inset-0 border-2 border-black/10 rounded-xl -translate-x-1.5 -translate-y-1.5" />
              <div className="absolute inset-0 border-2 border-black/5 rounded-xl translate-x-1.5 translate-y-1.5" />

              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img
                  src="/images/owner.png"
                  alt="Adesewa"
                  className="w-full h-auto object-cover aspect-square"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white/90 text-[10px] italic text-center">
                    Forever celebrated
                  </p>
                </div>
              </div>
            </div>

            {/* Birthday Message */}
            <div className="max-w-sm mx-auto text-center mb-5">
              <div className="flex justify-center gap-1.5 mb-3">
                <Heart className="w-3 h-3 text-black/40" />
                <Heart className="w-2.5 h-2.5 text-black/30" />
                <Heart className="w-3.5 h-3.5 text-black/40" />
              </div>
              <p className="text-black/60 text-sm leading-relaxed italic">
                "Today we celebrate you, your light, your laughter, and the
                beautiful soul you shared with all of us."
              </p>
            </div>

            {/* Personality Traits */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {[
                { icon: Heart, label: "Loving" },
                { icon: Star, label: "Radiant" },
                { icon: Feather, label: "Graceful" },
                { icon: Music, label: "Joyful" },
              ].map((trait, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <trait.icon className="w-2.5 h-2.5 text-black/40" />
                  <span className="text-[9px] tracking-wide text-black/50 uppercase">
                    {trait.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
            </div>

            {/* Memory Message */}
            <div className="text-center mb-6">
              <p className="text-black/40 text-[10px] leading-relaxed max-w-xs mx-auto">
                Though you've journeyed beyond, your spirit lives on in every
                heart you touched. Today, we honor the gift of you.
              </p>
            </div>

            {/* Bottom Decorative */}
            <div className="flex justify-center items-center gap-2">
              <div className="w-10 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
              <Sparkles className="w-3.5 h-3.5 text-black/30" />
              <div className="w-10 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
            </div>

            {/* Footer Text */}
            <div className="text-center mt-5">
              <p className="text-black/30 text-[8px] uppercase tracking-wider">
                Forever Remembered • Forever Celebrated
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </DefaultLayout>
  );
};

export default Birthday;
