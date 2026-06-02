const WeAreBack = () => {
  return (
    <div className="min-h-screen bg-[#fcf8f2] flex items-center justify-center p-4 md:p-8 antialiased">
      {/* Main Flier Container */}
      <div className="w-full max-w-4xl bg-[#fbf5eb] shadow-xl flex flex-col md:flex-row min-h-[600px] overflow-hidden border border-[#58182d]/10">
        {/* Column 1: Image & Branding (Left Side) */}
        <div className="relative w-full md:w-[40%] bg-[#ecdcc9] flex flex-col justify-center items-center p-8 min-h-[350px] md:min-h-full">
          {/* Background Grayscale Image */}
          <div
            className="absolute inset-0 bg-cover bg-center grayscale opacity-[0.65] mix-blend-multiply"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80')`,
            }}
          />
          {/* Warm Tint Overlay to match the Screenshot 2026-06-02 at 11.35.03.png framework */}
          <div className="absolute inset-0 bg-[#58182d]/5 backdrop-blur-[0.5px]" />

          {/* Brand Typography Container */}
          <div className="relative z-10 w-full flex justify-center px-4">
            <img
              src="/images/logo_dark.png"
              alt="SYS EMPIRE Logo"
              className="max-w-[300px] w-full h-auto drop-shadow-sm"
            />
          </div>
        </div>

        {/* Column 2: Sleek Announcement Content (Right Side) */}
        <div className="w-full md:w-[60%] bg-[#58182d] text-[#fbf5eb] p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle editorial background detail */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-[#fbf5eb]/5 pointer-events-none" />

          {/* Top Section: Heading */}
          <div className="mt-4">
            <p className="text-xs tracking-[0.25em] uppercase text-[#fbf5eb]/60 font-sans mb-3">
              An exciting update
            </p>
            <h1 className="text-5xl md:text-6xl font-serif font-light tracking-tight leading-[1.1] text-[#fbf5eb]">
              We're back to <br />
              <span className="italic font-normal text-white">
                take your orders
              </span>
            </h1>
            <div className="w-16 h-[2px] bg-[#fbf5eb]/30 mt-6 mb-8" />
          </div>

          {/* Middle Section: Premium Copywriting */}
          <div className="space-y-6 max-w-md my-auto">
            <p className="text-lg md:text-xl font-serif font-light leading-relaxed text-[#fbf5eb]/90">
              Our doors and digital channels are completely open. We are ready
              to bring your fashion visions to life with the precision you
              expect.
            </p>
            <p className="text-sm md:text-base font-light leading-relaxed text-[#fbf5eb]/70 tracking-wide">
              Every detail has been refined. From custom tailoring to premium
              delivery, we have stepped up our standards to ensure we serve you
              consistently, efficiently, and{" "}
              <span className="text-white font-medium">
                even better than before.
              </span>
            </p>
          </div>

          {/* Bottom Section: Call to Action & Operational Hours */}
          <div className="border-t border-[#fbf5eb]/20 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#fbf5eb]/50 font-sans">
                Experience the Empire
              </p>
              <p className="text-base font-serif font-medium tracking-wide text-white mt-0.5">
                Now accepting requests
              </p>
            </div>

            <div className="bg-[#fbf5eb]/10 px-4 py-2 border border-[#fbf5eb]/20 backdrop-blur-sm rounded-sm">
              <p className="text-[11px] font-mono tracking-wider text-center text-[#fbf5eb] uppercase">
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
