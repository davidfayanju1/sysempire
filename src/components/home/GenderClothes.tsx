import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const GenderClothes = () => {
  return (
    <section className="bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-[1100px] mx-auto text-center mb-12">
          <div className="w-12 h-px bg-black/20 mx-auto mb-6" />
          <h1 className="text-2xl md:text-3xl font-light text-black tracking-wide">
            Shop by Gender
          </h1>
          <div className="w-12 h-px bg-black/20 mx-auto mt-6" />
        </div>

        {/* Two Big Cards with Background Images */}
        <div className="grid md:grid-cols-2 gap-8 max-w-[1070px] mx-auto">
          {/* Female Card */}
          <Link
            to="/products?gender=female"
            className="group relative block overflow-hidden min-h-[400px] md:min-h-[500px] rounded-none"
          >
            {/* Unsplash Background Image - Women's Fashion */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 scale-105"
              style={{
                backgroundImage: "url('/images/female-clothing/orange.png')",
              }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />

            {/* Content */}
            <div className="relative h-full min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center text-center p-8">
              <span className="text-6xl md:text-7xl font-light text-white font-['Times_New_Roman',serif] mb-4">
                Women
              </span>
              <p className="text-sm text-white/80 mb-6 max-w-xs">
                Dresses • Tops • Skirts • Accessories
              </p>
              <div className="inline-flex items-center gap-2 text-white/80 group-hover:text-white transition-colors border-b border-white/30 pb-1">
                <span className="text-xs tracking-wider uppercase">
                  Shop Women
                </span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
          {/* Male Card */}
          <Link
            to="/products?gender=male"
            className="group relative block overflow-hidden min-h-[400px] md:min-h-[500px] rounded-none"
          >
            {/* Unsplash Background Image - Men's Fashion */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1663044022726-889ee51a682e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />

            {/* Content */}
            <div className="relative h-full min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center text-center p-8">
              <span className="text-6xl md:text-7xl font-light text-white font-['Times_New_Roman',serif] mb-4">
                Men
              </span>
              <p className="text-sm text-white/80 mb-6 max-w-xs">
                Suits • Shirts • Trousers • Accessories
              </p>
              <div className="inline-flex items-center gap-2 text-white/80 group-hover:text-white transition-colors border-b border-white/30 pb-1">
                <span className="text-xs tracking-wider uppercase">
                  Shop Men
                </span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GenderClothes;
