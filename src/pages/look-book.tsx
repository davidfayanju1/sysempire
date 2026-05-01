import { Heart, Flower2 } from "lucide-react";

const LookBookPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full border border-black/10 bg-white shadow-xl">
        {/* Ornate border top */}
        <div className="h-1 w-full bg-black/5" />

        <div className="p-12 md:p-16">
          {/* Logo Section */}
          <div className="text-center mb-12">
            <img
              src="/images/logo_dark.png"
              alt="SYS_EMPIRE"
              className="w-60 h-50 object-contain mx-auto mb-6"
            />

            {/* <span className="text-3xl font-bold tracking-widest text-black mb-4">
              SYS EMPIRE
            </span> */}
          </div>

          {/* Memorial Content */}
          <div className="text-center mt-[-4rem]">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 mb-8">
              <Heart className="w-3 h-3 text-black/40" />
              <span className="text-[8px] tracking-[0.2em] uppercase text-black/40 font-['Times_New_Roman',serif]">
                In Loving Memory
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-light text-black mb-3 tracking-tight">
              Mrs. Adesewa Oluwayanju
            </h1>
            <p className="text-black/40 text-[9px] tracking-[0.2em] uppercase mb-8">
              Founder & CEO · SYS_EMPIRE
            </p>

            <p className="text-black/70 text-sm leading-relaxed mb-6 font-['Times_New_Roman',serif]">
              It is with profound sadness that we announce the passing of our
              beloved Founder and CEO, Mrs. Adesewa Oluwayanju, who has departed
              to glory.
            </p>

            <div className="w-8 h-px bg-black/20 mx-auto my-8" />

            <p className="text-black/50 text-sm leading-relaxed mb-6">
              <span className="font-semibold text-black">SYS EMPIRE</span>{" "}
              continues as a luxury fashion firm, we remain fully committed to
              meeting and exceeding every one of your fashion needs, this was
              her vision, and her legacy lives on through our continued service
              to you.
            </p>

            <div className="flex justify-center my-8">
              <Flower2 className="w-6 h-6 text-black/20" />
            </div>

            <p className="text-black/40 text-xs italic font-['Times_New_Roman',serif]">
              — SYS EMPIRE Team
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-6 border-t border-black/5">
            <p className="text-black/25 text-[7px] tracking-[0.2em] uppercase">
              Her vision. Our commitment. Forever.
            </p>
          </div>
        </div>

        {/* Ornate border bottom */}
        <div className="h-1 w-full bg-black/5" />
      </div>
    </div>
  );
};

export default LookBookPage;
