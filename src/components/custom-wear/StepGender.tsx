import { ArrowRight } from "lucide-react";

interface StepGenderProps {
  onNext: (gender: "male" | "female") => void;
}

const StepGender = ({ onNext }: StepGenderProps) => {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
          Step 01
        </span>
        <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
          Who are we creating for?
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          At Sys, we celebrate every body. Let us know who we're designing for,
          and we'll tailor the experience just for you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Female Option */}
        <button
          onClick={() => onNext("female")}
          className="group cursor-pointer relative overflow-hidden aspect-[3/4] bg-white transition-all"
        >
          <img
            src="/images/female-clothing/orange.png"
            alt="Women's fashion"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-left">
            <h3 className="text-3xl md:text-4xl font-light text-white mb-2">
              SYS Women
            </h3>
            <p className="text-white/80 text-sm max-w-xs leading-relaxed">
              Elegant silhouettes that dance with grace. Timeless pieces
              designed for the woman who moves through life with confidence and
              poise.
            </p>
            <ArrowRight className="w-5 h-5 text-white/80 mt-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Male Option */}
        <button
          onClick={() => onNext("male")}
          className="group cursor-pointer relative overflow-hidden aspect-[3/4] bg-white transition-all"
        >
          <img
            src="https://images.unsplash.com/photo-1663044022726-889ee51a682e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Men's fashion"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-left">
            <h3 className="text-3xl md:text-4xl font-light text-white mb-2">
              SYS Men
            </h3>
            <p className="text-white/80 text-sm max-w-xs leading-relaxed">
              Powerful, elegant kings. Crafted from fine fibres that transcend
              time and generations. Strength redefined through impeccable
              tailoring.
            </p>
            <ArrowRight className="w-5 h-5 text-white/80 mt-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      <p className="text-center text-gray-400 text-xs mt-8">
        Our designs are thoughtfully crafted for all bodies and expressions
      </p>
    </section>
  );
};

export default StepGender;
