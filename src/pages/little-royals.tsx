import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Heart, Shirt, Sparkles } from "lucide-react";
import DefaultLayout from "../layout/DefaultLayout";
import KiddiesSlider from "../components/kids/KiddiesSlider";

const PINK = "#c96b82";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1714124731489-7eb16af0ac91?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1656741785524-1012253553b7?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555895417-90b96a0485b5?q=80&w=2000&auto=format&fit=crop",
];

const CATEGORY_CARDS = [
  {
    name: "Girls",
    subtitle: "Dresses • Rompers • Twirl-Worthy Everything",
    image:
      "https://images.unsplash.com/photo-1615175254861-f9f581d95996?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Boys",
    subtitle: "Suiting • Playwear • Little Gentleman Staples",
    image:
      "https://images.unsplash.com/photo-1647506138087-447f323e2c75?q=80&w=1200&auto=format&fit=crop",
  },
];

const VALUE_PROPS = [
  {
    icon: Shirt,
    title: "Soft, Safe Fabrics",
    description:
      "Breathable, skin-friendly materials chosen for play, naps, and everything in between.",
  },
  {
    icon: Sparkles,
    title: "Playful Silhouettes",
    description:
      "Twirl-ready dresses and easy separates designed for movement, mess, and mischief.",
  },
  {
    icon: Heart,
    title: "Handcrafted Details",
    description:
      "The same atelier finish as the main house, scaled down, never dumbed down.",
  },
];

const GALLERY_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1600&auto=format&fit=crop",
    caption: "Little Gentleman",
  },
  {
    image:
      "https://images.unsplash.com/photo-1631954977603-3dd385a2cf7c?q=80&w=1600&auto=format&fit=crop",
    caption: "Pretty in Lace",
  },
  {
    image:
      "https://images.unsplash.com/photo-1690645391255-a4f32816637a?q=80&w=1600&auto=format&fit=crop",
    caption: "Double the Charm",
  },
  {
    image:
      "https://images.unsplash.com/photo-1692195354246-2abe5015f9a7?q=80&w=1600&auto=format&fit=crop",
    caption: "Big Style, Little Royal",
  },
  {
    image:
      "https://images.unsplash.com/photo-1759313560250-3bb4bc1d10bc?q=80&w=1600&auto=format&fit=crop",
    caption: "Starlit & Stylish",
  },
  {
    image:
      "https://images.unsplash.com/photo-1645058493373-ed357396174d?q=80&w=1600&auto=format&fit=crop",
    caption: "Best Friends Forever",
  },
];

const FEATURED_LOOKS = [
  {
    name: "Heritage Print",
    image:
      "https://images.unsplash.com/photo-1598731470675-fd2af8f004c6?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Sunshine Romper",
    image:
      "https://images.unsplash.com/photo-1747069335589-0ff43ea6c941?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Beaded Braids",
    image:
      "https://images.unsplash.com/photo-1761370571919-0c99c0011d27?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Little Gentlemen Duo",
    image:
      "https://images.unsplash.com/photo-1778166071514-f37d443e6b3c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Heritage Twirl Dress",
    image:
      "https://images.unsplash.com/photo-1621163482527-33838fd50c03?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Free Spirit",
    image:
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1000&auto=format&fit=crop",
  },
];

const MARQUEE_WORDS = [
  "GIGGLES",
  "PLAYTIME",
  "SOFT FABRICS",
  "TINY STEPS",
  "BIG DREAMS",
  "STORYTIME",
  "COZY",
  "DISCOVERY",
  "SWEET DREAMS",
  "LITTLE ROYALS",
  "PRECIOUS",
  "WHIMSY",
];

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const LittleRoyalsPage = () => {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <DefaultLayout>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-[#3d1f28]">
        <AnimatePresence mode="sync">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: EASE }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${HERO_IMAGES[heroIndex]}')` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-linear-to-t from-[#2a1219]/85 via-[#2a1219]/35 to-[#2a1219]/25" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.img
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
            src="/images/sys_children_logo.JPG"
            alt="Little Royals by SYS Empire"
            className="w-28 md:w-36 h-auto object-contain mx-auto mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
            className="text-5xl md:text-7xl font-light text-white tracking-tight mb-6"
          >
            Little{" "}
            <span className="italic font-['Times_New_Roman',serif] text-[#f3c9d3]">
              Royals
            </span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-12 h-px bg-white/30 mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="text-white/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-10"
          >
            The SYS Empire promise, tailored for the smallest members of the
            family, playful silhouettes and atelier craftsmanship, made for
            little ones who already know how to make an entrance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: EASE }}
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 py-3.5 px-8 text-white text-xs tracking-[0.15em] uppercase transition-colors duration-300"
              style={{ backgroundColor: PINK }}
            >
              Enquire About Little Royals
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-white/30" />
        </div>
      </section>

      {/* Shop by category */}
      <section className="bg-[#fdf1f4]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-[1100px] mx-auto text-center mb-12">
            <div
              className="w-12 h-px mx-auto mb-6"
              style={{ background: `${PINK}4d` }}
            />
            <h2 className="text-2xl md:text-3xl font-light text-black tracking-wide">
              Shop Little Royals
            </h2>
            <div
              className="w-12 h-px mx-auto mt-6"
              style={{ background: `${PINK}4d` }}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-[1070px] mx-auto">
            {CATEGORY_CARDS.map((card) => (
              <Link
                key={card.name}
                to="/contact"
                className="group relative block overflow-hidden min-h-[400px] md:min-h-[500px]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${card.image}')` }}
                />
                <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors duration-300" />
                <div className="relative h-full min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center text-center p-8">
                  <span className="text-6xl md:text-7xl font-light text-white font-['Times_New_Roman',serif] mb-4">
                    {card.name}
                  </span>
                  <p className="text-sm text-white/80 mb-6 max-w-xs">
                    {card.subtitle}
                  </p>
                  <div className="inline-flex items-center gap-2 text-white/80 group-hover:text-white transition-colors border-b border-white/30 pb-1">
                    <span className="text-xs tracking-wider uppercase">
                      Enquire Now
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid md:grid-cols-3 gap-10 md:gap-8 max-w-[1100px] mx-auto">
            {VALUE_PROPS.map((prop, i) => (
              <motion.div
                key={prop.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.4 }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: `${PINK}1a` }}
                >
                  <prop.icon className="w-5 h-5" style={{ color: PINK }} />
                </div>
                <h3 className="text-lg font-medium text-black tracking-tight mb-2">
                  {prop.title}
                </h3>
                <p className="text-sm text-black/55 leading-relaxed max-w-xs mx-auto">
                  {prop.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery slider */}
      <section className="bg-[#fdf1f4]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-[1100px] mx-auto text-center mb-10">
            <div
              className="w-12 h-px mx-auto mb-6"
              style={{ background: `${PINK}4d` }}
            />
            <h2 className="text-2xl md:text-3xl font-light text-black tracking-wide">
              Kiddies, In Frame
            </h2>
            <div
              className="w-12 h-px mx-auto mt-6"
              style={{ background: `${PINK}4d` }}
            />
          </div>
          <KiddiesSlider
            slides={GALLERY_SLIDES}
            className="max-w-[1100px] mx-auto"
          />
        </div>
      </section>

      {/* Featured looks */}
      <section className="bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="flex items-end justify-between mb-12 max-w-[1100px] mx-auto">
            <div>
              <p
                className="text-[9px] tracking-[0.3em] uppercase mb-4 font-light"
                style={{ color: PINK }}
              >
                Preview
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-black tracking-tight">
                Featured Looks
              </h2>
            </div>
            <div className="hidden md:block w-24 h-px bg-black/10" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-[1100px] mx-auto">
            {FEATURED_LOOKS.map((look, i) => (
              <motion.div
                key={look.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={fadeUp}
                transition={{ delay: (i % 3) * 0.08 }}
                className="group relative overflow-hidden bg-gray-100"
                style={{ aspectRatio: "3 / 4" }}
              >
                <img
                  src={look.image}
                  alt={look.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                <span
                  className="absolute top-3 left-3 text-[8px] tracking-[0.2em] uppercase text-white px-2 py-1"
                  style={{ backgroundColor: PINK }}
                >
                  Coming Soon
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm md:text-base font-light tracking-wide">
                    {look.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div
        className="w-full overflow-hidden py-8 border-y"
        style={{ backgroundColor: `${PINK}0d`, borderColor: `${PINK}26` }}
      >
        <div className="relative">
          <div
            className="flex whitespace-nowrap"
            style={{
              animation: "little-royals-marquee 90s linear infinite",
              width: "max-content",
            }}
          >
            {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, index) => (
              <span
                key={index}
                className="text-xs md:text-sm tracking-[0.2em] uppercase mx-6 md:mx-8 font-['Times_New_Roman',serif]"
                style={{ color: `${PINK}cc` }}
              >
                {word}
                <span className="mx-6 md:mx-8 inline-block">
                  <Heart
                    className="w-2.5 h-2.5 inline"
                    style={{ color: `${PINK}66` }}
                  />
                </span>
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes little-royals-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* Final CTA */}
      <section className="bg-[#2a1219]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-28 text-center">
          <ArrowUpRight
            className="w-6 h-6 mx-auto mb-6"
            style={{ color: "#f3c9d3" }}
          />
          <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight mb-4 max-w-xl mx-auto">
            Ready to dress your little one like royalty?
          </h2>
          <p className="text-white/50 text-sm max-w-md mx-auto mb-10">
            Little Royals pieces are made to order. Reach out and our team will
            guide you through fabrics, sizing, and timelines.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 py-3.5 px-8 text-white text-xs tracking-[0.15em] uppercase transition-colors duration-300 hover:opacity-90"
            style={{ backgroundColor: PINK }}
          >
            Enquire About Little Royals
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default LittleRoyalsPage;
