import { ArrowRight } from "lucide-react";

interface StepOutfitTypeProps {
  onNext: (outfitType: string) => void;
}

const outfitCategories = [
  {
    id: "native-wear",
    name: "Native Wear",
    description: "Agbada, Kaftan, Dashiki, Buba, Iro ati Buba",
    image:
      "https://images.unsplash.com/photo-1688143029511-b37423aa60a2?q=80&w=986&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "corporate",
    name: "Corporate Wear",
    description: "Suits, Blazers, Corporate Dresses, Workwear",
    image:
      "https://images.unsplash.com/photo-1763739528420-bdc297ff4ec7?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "dresses",
    name: "Dresses",
    description: "Evening gowns, Cocktail dresses, Day dresses",
    image: "/images/female-clothing/blue.png",
  },
  {
    id: "suits",
    name: "Suits",
    description: "Two-piece, Three-piece, Tuxedos",
    image:
      "https://images.unsplash.com/photo-1649532355244-e011eebe7a81?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "casual",
    name: "Casual Wear",
    description: "Everyday comfort, Weekend style",
    image:
      "https://images.unsplash.com/photo-1614890085618-0e1054da74f8?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "wedding",
    name: "Wedding Wear",
    description: "Bridesmaids, Groom, Mother of the bride/groom",
    image: "/images/female-clothing/wedding-pose.png",
  },
  {
    id: "uniforms",
    name: "Uniforms",
    description: "Corporate uniforms, School uniforms, Team wear",
    image:
      "https://images.unsplash.com/photo-1654762549162-1f1e6387d67e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "other",
    name: "Something Else",
    description: "Tell us what you have in mind",
    image:
      "https://images.unsplash.com/photo-1625646741211-711bdd65c570?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const StepOutfitType = ({ onNext }: StepOutfitTypeProps) => {
  return (
    <section className="py-20 md:px-6 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
          Step 01
        </span>
        <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
          What are we making for you today?
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Choose your outfit type and we'll guide you through the perfect
          customization options.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 gap-3">
        {outfitCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onNext(category.id)}
            className="group relative aspect-3/4 overflow-hidden bg-gray-100 border border-black/5 hover:border-black/20 transition-all"
          >
            {/* Full Image */}
            <img
              src={category.image}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/70 transition-all" />

            {/* Content at bottom */}
            <div className="absolute bottom-0 left-0 right-0 md:p-5 p-2 text-left">
              <h3 className="text-lg md:text-xl font-light text-white mb-1">
                {category.name}
              </h3>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed mb-3">
                {category.description}
              </p>
              <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default StepOutfitType;
