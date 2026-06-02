import React from "react";

const WeAreBack = () => {
  return (
    <div className="min-h-screen bg-[#fcf8f2] flex items-center justify-center p-4 md:p-8 antialiased">
      {/* Main Flier Container */}
      <div
        className="w-full max-w-4xl min-h-[600px] shadow-2xl relative overflow-hidden border border-[#58182d]/10 bg-cover bg-[center_top] flex items-stretch"
        style={{
          backgroundImage: `url('/images/female-clothing/orange.png')`,
        }}
      >
        {/* 
          Sleek Gradient Overlay (Reversed): 
          Now fades from semi-clear on the left to deeper wine on the right side 
          to provide a perfect background for the text on the right.
        */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#2a0b15]/95 via-[#58182d]/80 to-[#58182d]/20 z-10" />
        <div className="absolute inset-0 bg-[#2a0b15]/5 backdrop-blur-[0.3px] z-10" />

        {/* Absolute TOP-LEFT Logo Placement */}
        <div className="absolute top-6 left-6 md:top-10 md:left-10 z-30 max-w-[140px] md:max-w-[185px]">
          <img
            src="/images/logo_dark.png"
            alt="SYS EMPIRE Logo"
            className="w-full h-auto brightness-0 invert opacity-95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          />
        </div>

        {/* Text Content Overlay Container - Shifted to the right side */}
        <div className="w-full md:w-[65%] lg:w-[65%] md:ml-auto text-[#fbf5eb] p-8 md:p-16 relative z-20 flex flex-col justify-between min-h-[600px]">
          {/* Top Section: Heading */}
          <div className="mt-16 md:mt-4">
            <p className="text-xs tracking-[0.25em] uppercase text-[#fbf5eb]/70 font-sans mb-3 font-medium drop-shadow-sm">
              An exciting update
            </p>
            <h1 className="text-5xl md:text-6xl font-serif font-light tracking-tight leading-[1.1] text-[#fbf5eb] drop-shadow-sm">
              We're back to <br />
              <span className="italic font-normal text-white drop-shadow-md">
                take your orders
              </span>
            </h1>
            <div className="w-16 h-[2px] bg-[#fbf5eb]/40 mt-6 mb-8" />
          </div>

          {/* Middle Section: Premium Copywriting */}
          <div className="space-y-6 max-w-xl my-auto py-4 drop-shadow-sm">
            <p className="text-lg md:text-xl font-serif font-light leading-relaxed text-[#fbf5eb] text-balance">
              Our doors and digital channels are completely open. We are ready
              to bring your fashion visions to life with the precision you
              expect.
            </p>
            <p className="text-sm md:text-base font-light leading-relaxed text-[#fbf5eb]/85 tracking-wide text-balance">
              Every detail has been refined. From custom tailoring to premium
              delivery, we have stepped up our standards to ensure we serve you
              consistently, efficiently, and{" "}
              <span className="text-white font-medium underline decoration-[#fbf5eb]/40 underline-offset-4">
                even better than before.
              </span>
            </p>
          </div>

          {/* Bottom Section: Call to Action & Operational Hours */}
          <div className="border-t border-[#fbf5eb]/20 pt-8 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#fbf5eb]/60 font-sans font-medium">
                Experience the Empire
              </p>
              <p className="text-base font-serif font-medium tracking-wide text-white mt-0.5 drop-shadow-sm">
                Now accepting requests
              </p>
            </div>

            <div className="bg-[#2a0b15]/40 px-4 py-2 border border-[#fbf5eb]/30 backdrop-blur-md rounded-sm shadow-inner">
              <p className="text-[11px] font-mono tracking-wider text-center text-white uppercase font-bold">
                Daily 8AM — 7PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeAreBack;
