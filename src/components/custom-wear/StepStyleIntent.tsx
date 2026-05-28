import { ArrowRight, Sparkles, Heart, ChevronLeft } from "lucide-react";

interface StepStyleIntentProps {
  onBack: () => void;
  onNext: (hasStyleInMind: boolean, styleDescription?: string) => void;
}

const StepStyleIntent = ({ onBack, onNext }: StepStyleIntentProps) => {
  return (
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
          Step 02
        </span>
        <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
          Tell us where to start
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Every custom piece begins with a conversation. How would you like to
          begin your journey with us?
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <button
          onClick={() => onNext(true)}
          className="group p-8 bg-white border border-black/5 hover:border-black/20 transition-all text-left"
        >
          <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-black/10 transition">
            <Sparkles className="w-5 h-5 text-black/60" />
          </div>
          <h3 className="text-xl font-medium mb-2">I have a style in mind</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            You already know what you want, let's bring your exact vision to
            life.
          </p>
          <ArrowRight className="w-4 h-4 mt-4 text-black/40 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => onNext(false)}
          className="group p-8 bg-white border border-black/5 hover:border-black/20 transition-all text-left"
        >
          <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-black/10 transition">
            <Heart className="w-5 h-5 text-black/60" />
          </div>
          <h3 className="text-xl font-medium mb-2">I need inspiration</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Not sure yet? Let us guide you through styles, fabrics, and designs
            that suit you.
          </p>
          <ArrowRight className="w-4 h-4 mt-4 text-black/40 group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Gender
        </button>
      </div>
    </section>
  );
};

export default StepStyleIntent;
