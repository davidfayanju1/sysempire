import DefaultLayout from "../layout/DefaultLayout";
import { useState } from "react";
import {
  Ruler,
  Sparkles,
  Scissors,
  ArrowRight,
  Heart,
  Coffee,
} from "lucide-react";

const CustomWear = () => {
  const [step, setStep] = useState(1);
  const [, setHasStyleInMind] = useState<boolean | null>(null);

  const handleStyleChoice = (choice: boolean) => {
    setHasStyleInMind(choice);
    setStep(2);
  };

  const handleNext = () => {
    setStep(3);
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-[#fefaf5]">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1619384259054-ee3ce9d1798c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Fashion designer's workspace"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Warm Color Overlay (subtle, adds warmth) */}
          <div className="absolute inset-0 bg-amber-900/20 z-0" />

          {/* Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full mb-8 border border-white/20">
              <Heart className="w-4 h-4 text-rose-400" />
              <span className="text-[11px] tracking-[0.2em] uppercase text-black/70 font-serif">
                Made Just For You
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-6">
              Your Vision.
              <br />
              <span className="font-serif italic font-bold">Our Hands.</span>
            </h1>

            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Step into our creative space. Whether you come with a dream or
              need a little inspiration, we're here to bring your perfect piece
              to life.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-10 text-xs text-white/60">
              <span className="flex items-center gap-1">
                <Ruler className="w-3 h-3" /> Precise Measurements
              </span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              <span className="flex items-center gap-1">
                <Scissors className="w-3 h-3" /> Expert Craftsmanship
              </span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              <span className="flex items-center gap-1">
                <Coffee className="w-3 h-3" /> Warm Consultation
              </span>
            </div>
          </div>

          {/* Scroll Hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
            <div className="w-5 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-0.5 h-2 bg-white/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </section>

        {/* Step 1: Welcome & Intent */}
        {step === 1 && (
          <section className="py-20 px-6 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
                Step 01
              </span>
              <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
                Tell us where to start
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto">
                Every custom piece begins with a conversation. How would you
                like to begin your journey with us?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button
                onClick={() => handleStyleChoice(true)}
                className="group p-8 bg-white border border-black/5 hover:border-black/20 transition-all text-left"
              >
                <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-black/10 transition">
                  <Sparkles className="w-5 h-5 text-black/60" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  I have a style in mind
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  You already know what you want, let's bring your exact vision
                  to life.
                </p>
                <ArrowRight className="w-4 h-4 mt-4 text-black/40 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={() => handleStyleChoice(false)}
                className="group p-8 bg-white border border-black/5 hover:border-black/20 transition-all text-left"
              >
                <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-black/10 transition">
                  <Heart className="w-5 h-5 text-black/60" />
                </div>
                <h3 className="text-xl font-medium mb-2">I need inspiration</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Not sure yet? Let us guide you through styles, fabrics, and
                  designs that suit you.
                </p>
                <ArrowRight className="w-4 h-4 mt-4 text-black/40 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </section>
        )}

        {/* Step 2: The Experience */}
        {step === 2 && (
          <section className="py-20 px-6 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
                Step 02
              </span>
              <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
                Come visit our creative space
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto">
                We believe the best designs happen when we create together, in
                person, with warmth and attention.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ruler className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-medium mb-2">1. Precise Measurements</h3>
                <p className="text-gray-400 text-sm">
                  Your perfect fit starts with careful, personalized measuring.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scissors className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-medium mb-2">2. Fabric Selection</h3>
                <p className="text-gray-400 text-sm">
                  Touch, feel, and choose from our curated collection of premium
                  fabrics.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-medium mb-2">3. Design Consultation</h3>
                <p className="text-gray-400 text-sm">
                  We sketch, adjust, and refine until every detail feels like
                  you.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition"
              >
                Book a Consultation <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-400 mt-4">
                First consultation is always on us — with coffee or tea, your
                choice.
              </p>
            </div>
          </section>
        )}

        {/* Step 3: Closing warmth */}
        {step === 3 && (
          <section className="py-20 px-6 max-w-2xl mx-auto text-center">
            <div className="bg-white/60 backdrop-blur-sm p-12 border border-black/5">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coffee className="w-7 h-7 text-amber-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-light mb-4">
                We can't wait to meet you.
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Our studio is a warm, welcoming space where your ideas become
                wearable art. Bring your vision, your mood board, or just
                yourself — we'll handle the rest.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition">
                  Schedule a Visit
                </button>
                <button className="px-8 py-3 border border-black/20 text-black text-sm uppercase tracking-wider hover:bg-black/5 transition">
                  Browse Inspiration Gallery
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </DefaultLayout>
  );
};

export default CustomWear;
