import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shirt, ImageOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import DefaultLayout from "../layout/DefaultLayout";
import { getCategoryBySlug } from "../data/category-data";
import { getProducts } from "../services";
import ProductGridSkeleton from "../components/product/ProductGridSkeleton";
import PageLoadingOverlay from "../components/common/PageLoadingOverlay";

// Encapsulated Product Card to isolate hover state and prevent parent page re-renders
const ProductCard = ({
  product,
  index,
  onNavigate,
}: {
  product: any;
  index: number;
  onNavigate: (path: string) => void;
}) => {
  const primaryImage =
    product.images?.find((img: any) => img.isPrimary)?.url ??
    product.images?.[0]?.url;
  const isOutOfStock = product.stock <= 0;

  // Prioritize the top row (first 2 items on mobile, 4 on desktop)
  const isAboveFold = index < 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
      className="group cursor-pointer"
      onClick={() => onNavigate(`/product/${product.id}`)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-4">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            width={400}
            height={533}
            loading={isAboveFold ? "eager" : "lazy"}
            fetchPriority={isAboveFold ? "high" : "auto"}
            decoding="async"
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              isOutOfStock ? "grayscale opacity-60" : ""
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}

        {isOutOfStock && (
          <span className="absolute top-3 left-3 bg-black/80 text-white text-[10px] tracking-[0.15em] uppercase px-3 py-1">
            Out of Stock
          </span>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <button className="bg-white text-black px-6 py-2 text-xs tracking-[0.2em] uppercase font-light hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-sm">
            View Details
            <ArrowRight className="w-3 h-3" />
          </button>
        </motion.div>
      </div>

      <div className="text-center">
        <p className="text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-2 font-light">
          {product.category?.name ?? ""}
        </p>
        <h4 className="text-sm font-light mb-2 text-gray-800">
          {product.name}
        </h4>
        <p className="text-sm text-gray-900 font-light">
          ₦{product.finalPrice.toLocaleString("en-NG")}
        </p>
      </div>
    </motion.div>
  );
};

const Wears = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const category = getCategoryBySlug(name ?? "");
  const [heroImageError, setHeroImageError] = useState(false);

  useEffect(() => {
    if (!category) {
      console.warn(`Category not found for slug: ${name}`);
      navigate("/");
      return;
    }
    window.scrollTo(0, 0);
  }, [category, name, navigate]);

  const {
    data: productsRes,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const allProducts = useMemo(() => productsRes?.data ?? [], [productsRes]);

  const genderFilter = (name ?? "").startsWith("women")
    ? "female"
    : (name ?? "").startsWith("men")
      ? "male"
      : null;

  const products = useMemo(() => {
    return genderFilter
      ? allProducts.filter((product) => product.gender === genderFilter)
      : allProducts;
  }, [allProducts, genderFilter]);

  const retryFetchProducts = () => {
    setHeroImageError(false);
    refetchProducts();
  };

  const productImages = useMemo(() => {
    return products
      .map((product) => {
        const primary = product.images?.find((img) => img.isPrimary)?.url;
        return primary ?? product.images?.[0]?.url;
      })
      .filter((url): url is string => Boolean(url));
  }, [products]);

  const heroImage = productImages[0];
  const heroHasError = productsError || heroImageError;
  const heroIsEmpty = !productsLoading && !heroHasError && !heroImage;

  const getStoryImage = (index: number) => {
    if (productsLoading) return undefined;
    if (productImages.length > 0) {
      return productImages[index % productImages.length];
    }
    return category?.featured?.[index]?.image;
  };

  if (!category) {
    return (
      <>
        <PageLoadingOverlay isLoading={true} />
        <DefaultLayout>
          <div className="min-h-screen" />
        </DefaultLayout>
      </>
    );
  }

  return (
    <>
      {/* 1. Preload LCP Hero Asset as early as possible into Document Head */}
      {heroImage && !heroHasError && (
        <Helmet>
          <link
            rel="preload"
            as="image"
            href={heroImage}
            fetchPriority="high"
          />
        </Helmet>
      )}

      <PageLoadingOverlay isLoading={productsLoading} />
      <DefaultLayout>
        <div className="bg-white">
          {/* Cinematic Hero Section */}
          <section className="relative h-screen w-full overflow-hidden bg-neutral-900">
            <div className="absolute inset-0">
              {productsLoading ? (
                <div className="w-full h-full bg-neutral-800 animate-pulse" />
              ) : heroHasError ? (
                <div className="w-full h-full bg-neutral-900" />
              ) : heroIsEmpty ? (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                  <Shirt className="w-24 h-24 text-white/20" strokeWidth={1} />
                </div>
              ) : (
                <>
                  {/* Hero LCP Optimization */}
                  <img
                    src={heroImage}
                    alt={category.name}
                    width={1920}
                    height={1080}
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                    onError={() => setHeroImageError(true)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </>
              )}
            </div>

            <div className="relative h-full flex items-center justify-center text-center px-6">
              {heroHasError ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center gap-4"
                >
                  <ImageOff
                    className="w-14 h-14 text-white/30"
                    strokeWidth={1}
                  />
                  <p className="text-white/50 text-[10px] tracking-[0.2em] uppercase text-center">
                    Unable to load collection imagery
                  </p>
                  <button
                    onClick={retryFetchProducts}
                    className="text-white/70 text-[10px] tracking-[0.2em] uppercase border border-white/20 px-5 py-2 hover:border-white/50 hover:text-white transition-colors"
                  >
                    Retry
                  </button>
                </motion.div>
              ) : (
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
                    className="text-white text-5xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.04em] sm:tracking-[0.08em] md:tracking-[0.15em] mb-8 break-words"
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
              )}
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
                    <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                      {getStoryImage(0) ? (
                        <img
                          src={getStoryImage(0)}
                          alt="Collection preview 1"
                          width={400}
                          height={533}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full animate-pulse" />
                      )}
                    </div>
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      {getStoryImage(1) ? (
                        <img
                          src={getStoryImage(1)}
                          alt="Collection preview 2"
                          width={400}
                          height={400}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full animate-pulse" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-4 pt-12">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      {getStoryImage(2) ? (
                        <img
                          src={getStoryImage(2)}
                          alt="Collection preview 3"
                          width={400}
                          height={400}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full animate-pulse" />
                      )}
                    </div>
                    <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                      {getStoryImage(3) ? (
                        <img
                          src={getStoryImage(3)}
                          alt="Collection preview 4"
                          width={400}
                          height={533}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full animate-pulse" />
                      )}
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

              {productsLoading ? (
                <ProductGridSkeleton count={8} />
              ) : products.length === 0 ? (
                <p className="text-center text-gray-400 text-sm font-light tracking-wide">
                  No products available right now. Check back soon.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 md:gap-8 gap-4">
                  {products.slice(0, 8).map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      onNavigate={navigate}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Full-Width Image Divider */}
          {getStoryImage(0) && (
            <section className="relative h-[60vh] overflow-hidden bg-neutral-900">
              <motion.div
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="w-full h-full"
              >
                <img
                  src={getStoryImage(0)}
                  alt="Collection showcase"
                  width={1600}
                  height={900}
                  loading="lazy"
                  decoding="async"
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
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </DefaultLayout>
    </>
  );
};

export default Wears;
