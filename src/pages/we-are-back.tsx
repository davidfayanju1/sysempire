const WeAreBack = () => {
  return (
    <div className="min-h-screen bg-[#ddd8d2] flex items-center justify-center p-6 md:p-12 antialiased">
      {/* Phone / door-hanger card */}
      <div
        className="relative w-full max-w-[380px] rounded-[2.5rem] overflow-hidden shadow-2xl"
        style={{ aspectRatio: "9 / 16" }}
      >
        {/* ── Background image + overlay ── */}
        <div className="absolute inset-0">
          <img
            src="/images/female-clothing/wedding-pose.png"
            alt=""
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 h-full flex flex-col px-7 pt-6 pb-6">
          {/* Logo */}
          <div className="mb-2 -ml-6">
            <img
              src="/images/logo_light.png"
              alt="SYS EMPIRE"
              className="h-22 w-auto object-contain object-left"
            />
          </div>

          {/* Headline — WE'RE OPEN */}
          <div className="mt-16 text-center mb-8 flex flex-col justify-center">
            <h1 className="font-black text-white leading-[0.88] tracking-tight">
              <span className="block text-[4.5rem] -rotate-6 origin-left mb-[-.5rem]">
                WE'RE
              </span>
              <span
                className="block text-[6.25rem]"
                style={{
                  transform: "scaleY(1.25)",
                  transformOrigin: "top left",
                }}
              >
                OPEN
              </span>
            </h1>
          </div>

          {/* Hours */}
          <div className="space-y-2 mb-[7rem] flex items-center flex-col mx-auto mb-5">
            <span className="inline-block bg-white text-black text-[10px] font-bold tracking-[0.22em] uppercase px-5 py-1.5 rounded-full">
              Monday to Friday
            </span>
            <p className="text-[1.25rem] font-[500] text-white leading-none tracking-tight">
              9AM – 5PM
            </p>
          </div>

          {/* Address */}
          <div className="mb-2 text-center">
            <p className="text-white/55 text-[9px] font-bold tracking-[0.28em] uppercase mb-1.5">
              Visit Us At
            </p>
            <p className="text-white text-[13px] font-semibold leading-snug">
              No.8 Adewale Adegbosin, Ajah.
            </p>
            <p className="text-white text-[13px] font-semibold">Lagos state</p>
          </div>

          {/* Footer info bar */}
          <div className="border border-white/35 rounded-full px-3 py-2 flex items-center justify-between gap-1">
            <span className="text-white/65 text-[8.5px] font-medium tracking-wide whitespace-nowrap">
              Further Information
            </span>
            <div className="w-px h-3 bg-white/25 shrink-0" />
            <span className="text-white text-[8.5px] font-semibold whitespace-nowrap">
              ☎ 09162588511
            </span>
            <div className="w-px h-3 bg-white/25 shrink-0" />
            <span className="text-white text-[8.5px] whitespace-nowrap">
              sysempire.vercel.app
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeAreBack;
