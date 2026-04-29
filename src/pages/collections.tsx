import DefaultLayout from "../layout/DefaultLayout";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Heart, Sparkles, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Collections = () => {
  const [hoveredCollection, setHoveredCollection] = useState<number | null>(
    null,
  );
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });

  const collections = [
    {
      id: 1,
      title: "HERITAGE",
      subtitle: "The Beginning",
      year: "2014",
      description:
        "Where it all began. Ten handcrafted pieces that captured the essence of African elegance.",
      image:
        "https://images.unsplash.com/photo-1696962701419-6f510910e838?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      pieces: 10,
      lookbook: "/collections/heritage",
    },
    {
      id: 2,
      title: "DIASPORA",
      subtitle: "International Debut",
      year: "2016",
      description:
        "Traditional African textiles meeting contemporary silhouettes. A love letter to cultural fusion.",
      image:
        "https://images.unsplash.com/photo-1648329008114-bce0ec0b5950?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      pieces: 24,
      lookbook: "/collections/diaspora",
    },
    {
      id: 3,
      title: "AFRO-FUTURISM",
      subtitle: "Flagship Launch",
      year: "2019",
      description:
        "A bold vision of tomorrow, rooted in ancestral heritage. Critically acclaimed at Lagos Fashion Week.",
      image:
        "https://images.unsplash.com/photo-1666985152385-5075e84caf0e?q=80&w=1360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      pieces: 32,
      lookbook: "/collections/afro-futurism",
    },
    {
      id: 4,
      title: "GLOBAL CITIZEN",
      subtitle: "Worldwide Recognition",
      year: "2021",
      description:
        "Featured in Vogue, Elle, and Harper's Bazaar. A collection for the modern nomad.",
      image:
        "https://images.unsplash.com/photo-1619610405999-d6ab699dc9b4?q=80&w=990&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      pieces: 28,
      lookbook: "/collections/global-citizen",
    },
    {
      id: 5,
      title: "CONSCIOUS COUTURE",
      subtitle: "Sustainable Future",
      year: "2024",
      description:
        "Eco-conscious luxury. Sustainable materials, ethical practices, timeless design.",
      image:
        "https://images.unsplash.com/photo-1668035188870-9bba52206be9?q=80&w=1015&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      pieces: 18,
      lookbook: "/collections/conscious-couture",
    },
  ];

  const featuredPiece = {
    title: "THE SIGNATURE",
    description:
      "Each collection tells a unique story. Every garment is a testament to craftsmanship, culture, and the relentless pursuit of beauty.",
    image:
      "https://images.unsplash.com/photo-1763823132521-72f373850de2?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1502217625004-89c03571bcca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 mb-6">
            <Sparkles className="w-3 h-3 text-white/60" />
            <span className="text-[8px] tracking-[0.2em] uppercase text-white/60 font-['Times_New_Roman',serif]">
              Archive
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-tight">
            The Collections
          </h1>
          <div className="w-12 h-px bg-white/30 mx-auto mb-6" />
          <p className="text-white/60 text-sm max-w-2xl mx-auto leading-relaxed">
            A decade of design excellence. Each collection represents a chapter
            in our ongoing story of African luxury.
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-white/30" />
        </div>
      </section>
      {/* Featured Piece */}
      // Featured Piece section - updated image handling
      <section ref={heroRef} className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate={isHeroInView ? "visible" : "hidden"}
              variants={fadeUpVariants}
              className="order-2 md:order-1"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 mb-6">
                <Eye className="w-3 h-3 text-black/40" />
                <span className="text-[8px] tracking-[0.2em] uppercase text-black/40 font-['Times_New_Roman',serif]">
                  Featured
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-light text-black mb-4 tracking-tight">
                {featuredPiece.title}
              </h2>
              <div className="w-12 h-px bg-black/15 mb-6" />
              <p className="text-black/60 text-sm leading-relaxed mb-8">
                {featuredPiece.description}
              </p>
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors group text-xs tracking-[0.15em] uppercase"
              >
                Explore Archive
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div
              initial="hidden"
              animate={isHeroInView ? "visible" : "hidden"}
              variants={fadeUpVariants}
              className="order-1 md:order-2 border border-black/10 overflow-hidden bg-gray-100"
            >
              {/* Option 1: Use background image with cover and a wrapper div */}
              <div
                className="w-full h-[450px] bg-cover bg-center bg-no-repeat grayscale hover:grayscale-0 transition-all duration-700"
                style={{
                  backgroundImage: `url('${featuredPiece.image}')`,
                  backgroundPosition: "center 30%", // Adjust this value to show more of the outfit
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>
      {/* Collections Grid */}
      <section className="py-24 bg-white border-t border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 mb-6">
              <Heart className="w-3 h-3 text-black/40" />
              <span className="text-[8px] tracking-[0.2em] uppercase text-black/40 font-['Times_New_Roman',serif]">
                By Year
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-black tracking-tight">
              Signature Collections
            </h2>
            <div className="w-12 h-px bg-black/15 mx-auto mt-6" />
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerVariants}
          >
            {collections.map((collection) => (
              <motion.div
                key={collection.id}
                variants={cardVariants}
                className="group relative border border-black/10 bg-white overflow-hidden"
                onMouseEnter={() => setHoveredCollection(collection.id)}
                onMouseLeave={() => setHoveredCollection(null)}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Year Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1">
                    <span className="text-[8px] tracking-[0.2em] uppercase text-black font-semibold">
                      {collection.year}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-black/40">
                        {collection.subtitle}
                      </p>
                      <h3 className="text-xl font-light text-black mt-1 tracking-tight">
                        {collection.title}
                      </h3>
                    </div>
                    <span className="text-[10px] text-black/30">
                      {collection.pieces} pieces
                    </span>
                  </div>
                  <p className="text-black/60 text-sm leading-relaxed mt-3">
                    {collection.description}
                  </p>

                  {/* Animated Button - appears on hover */}
                  <div className="mt-6 overflow-hidden">
                    <Link
                      to={collection.lookbook}
                      className="inline-flex items-center gap-2 text-black/40 hover:text-black transition-colors group text-xs tracking-[0.1em] uppercase"
                    >
                      <span className="translate-y-0 group-hover:-translate-y-6 transition-transform duration-300 inline-block">
                        View Lookbook
                      </span>

                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Subtle hover overlay */}
                <div
                  className={`absolute inset-0 border-2 border-black/0 transition-all duration-300 pointer-events-none ${hoveredCollection === collection.id ? "border-black/10" : ""}`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* Editorial Quote Section */}
      <section className="py-24 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-px bg-white/20 mx-auto mb-8" />
            <p className="text-white/40 text-[8px] tracking-[0.3em] uppercase mb-6">
              Philosophy
            </p>
            <h2 className="text-2xl md:text-3xl font-light text-white leading-relaxed">
              "Fashion is not just about clothing. It's about identity,
              heritage, and the stories we choose to wear."
            </h2>
            <div className="w-12 h-px bg-white/20 mx-auto mt-8" />
            <p className="text-white/30 text-[9px] tracking-[0.2em] uppercase mt-6">
              — Creative Director
            </p>
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 mb-6">
              <Sparkles className="w-3 h-3 text-black/40" />
              <span className="text-[8px] tracking-[0.2em] uppercase text-black/40 font-['Times_New_Roman',serif]">
                Inquire
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-light text-black mb-4 tracking-tight">
              Interested in a collection piece?
            </h3>
            <p className="text-black/60 text-sm max-w-md mx-auto mb-8">
              Select pieces from past collections are available by special
              request.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white hover:bg-black/90 transition-all duration-300 text-sm tracking-[0.1em] uppercase group"
            >
              Inquire Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default Collections;
