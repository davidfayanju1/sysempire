import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import DefaultLayout from "../layout/DefaultLayout";
import { getCollections, getCollectionProducts } from "../services";
import ProductGridSkeleton from "../components/product/ProductGridSkeleton";
import PageLoadingOverlay from "../components/common/PageLoadingOverlay";

const CollectionDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: collectionsRes, isLoading: collectionsLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: getCollections,
    staleTime: 5 * 60 * 1000,
  });
  const collection = collectionsRes?.data.find((c) => c.slug === slug);

  useEffect(() => {
    if (!collectionsLoading && !collection) {
      console.warn(`Collection not found for slug: ${slug}`);
      navigate("/collection");
    }
  }, [collectionsLoading, collection, slug, navigate]);

  const {
    data: productsRes,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["collection-products", collection?.id],
    queryFn: () => getCollectionProducts(collection!.id),
    enabled: !!collection,
  });
  const products = productsRes?.data ?? [];

  const isLoading = collectionsLoading || (!!collection && productsLoading);

  if (collectionsLoading || !collection) {
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
    <DefaultLayout>
      <div className="bg-white">
        {/* Hero */}
        <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden bg-neutral-900">
          <img
            src={collection.coverImage}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute inset-0 flex items-end">
            <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-white/70">
                    {collection.season} {collection.year}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-white/70 capitalize">
                    {collection.gender}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-light text-white tracking-tight mb-4">
                  {collection.name}
                </h1>
                {collection.tagline && (
                  <p className="text-white/70 text-base md:text-lg italic mb-6">
                    {collection.tagline}
                  </p>
                )}
                {collection.description && (
                  <p className="text-white/60 text-sm leading-relaxed max-w-xl">
                    {collection.description}
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-20 md:py-28">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-4 font-light">
                From The Collection
              </h2>
              <h3 className="text-3xl md:text-4xl font-light">
                {collection.pieceCount}{" "}
                {collection.pieceCount === 1 ? "Piece" : "Pieces"}
              </h3>
            </div>

            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : productsError ? (
              <p className="text-center text-gray-400 text-sm font-light tracking-wide">
                Couldn't load products for this collection. Please try again.
              </p>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 text-sm font-light tracking-wide">
                  No pieces published for this collection yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 md:gap-8 gap-4">
                {products.map((product, index) => (
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
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                            !product.inStock ? "grayscale opacity-60" : ""
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                      {!product.inStock && (
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
                        <button className="bg-white text-black px-6 py-2 text-xs tracking-[0.2em] uppercase font-light hover:bg-gray-100 transition-colors flex items-center gap-2">
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
                        ₦{product.price.toLocaleString("en-NG")}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
};

export default CollectionDetails;
