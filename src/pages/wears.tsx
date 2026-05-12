import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import DefaultLayout from "../layout/DefaultLayout";
import { getCategoryBySlug } from "../data/category-data";

const Wears = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<any>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const categoryData = getCategoryBySlug(name ?? "");
    if (categoryData) {
      setCategory(categoryData);
      window.scrollTo(0, 0);
    } else {
      // Redirect to home if category not found
      console.warn(`Category not found for slug: ${name}`);
      navigate("/");
    }
  }, [name, navigate]);

  if (!category) {
    return (
      <DefaultLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="bg-white">
        {/* Cinematic Hero Section */}
        <section className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0">
            {!videoError && category.hero?.video ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                onError={() => setVideoError(true)}
                className="w-full h-full object-cover"
              >
                <source src={category.hero.video} type="video/mp4" />
              </video>
            ) : (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${category.hero?.fallbackImage || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070"})`,
                }}
              />
            )}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative h-full flex items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="max-w-4xl"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-white/70 text-[10px] tracking-[0.3em] uppercase mb-4 font-light"
              >
                {category.hero?.subtitle || category.name}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="text-white text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.15em] mb-8"
              >
                {category.hero?.title || category.name.toUpperCase()}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="h-[1px] w-24 bg-white/50 mx-auto"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-[1px] h-16 bg-white/50"
            />
          </motion.div>
        </section>

        {/* Story Section */}
        {category.story && (
          <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-6 font-light">
                  Our Story
                </h2>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-light mb-8 leading-tight">
                  {category.story.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-base md:text-lg font-light">
                  {category.story.description}
                </p>
                <div className="border-l-2 border-black pl-6">
                  <p className="text-lg md:text-xl italic text-gray-800 font-light">
                    "{category.story.quote}"
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-4">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={category.featured[0]?.image}
                      alt="Collection preview 1"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={category.featured[1]?.image}
                      alt="Collection preview 2"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={category.featured[2]?.image}
                      alt="Collection preview 3"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={category.featured[3]?.image}
                      alt="Collection preview 4"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Featured Products Section */}
        <section className="bg-gray-50 py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-4 font-light">
                In-House Collection
              </h2>
              <h3 className="text-3xl md:text-4xl font-light">
                Curated Selection
              </h3>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {category.featured?.map((product: any, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <button className="bg-white text-black px-6 py-2 text-xs tracking-[0.2em] uppercase font-light hover:bg-gray-100 transition-colors flex items-center gap-2">
                        View Details
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </motion.div>
                  </div>

                  <div className="text-center">
                    <p className="text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-2 font-light">
                      {product.category}
                    </p>
                    <h4 className="text-sm font-light mb-2 text-gray-800">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-900 font-light">
                      ${product.price.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mt-16"
            >
              <button
                onClick={() => navigate(`/collection/${category.slug}`)}
                className="inline-flex items-center gap-3 border border-black px-8 py-3 text-xs tracking-[0.25em] uppercase font-light hover:bg-black hover:text-white transition-all duration-500"
              >
                Explore Full Collection
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Full-Width Image Divider */}
        {category.featured && category.featured[0] && (
          <section className="relative h-[60vh] overflow-hidden">
            <motion.div
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="w-full h-full"
            >
              <img
                src={category.featured[0]?.image}
                alt="Collection showcase"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-8 leading-tight">
                Experience the Collection
              </h2>
              <p className="text-gray-600 text-base md:text-lg mb-12 font-light max-w-2xl mx-auto">
                Visit our atelier for a personalized consultation and discover
                how we bring your vision to life with bespoke craftsmanship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/contact")}
                  className="bg-black text-white px-8 py-3 text-xs tracking-[0.25em] uppercase font-light hover:bg-gray-800 transition-colors"
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => navigate(`/collection/${category.slug}`)}
                  className="border border-black text-black px-8 py-3 text-xs tracking-[0.25em] uppercase font-light hover:bg-black hover:text-white transition-all duration-500"
                >
                  View Lookbook
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
};

export default Wears;
