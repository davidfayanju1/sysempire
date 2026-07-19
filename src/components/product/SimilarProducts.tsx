// src/components/product/SimilarProducts.tsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Product } from "../../types/product";

interface SimilarProductsProps {
  products: Product[];
}

const SimilarProducts = ({ products }: SimilarProductsProps) => {
  const navigate = useNavigate();

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-20 pt-12 border-t border-gray-100">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-3">
          You May Also Like
        </h2>
        <div className="w-16 h-px bg-gray-300 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
              <img
                src={product.images[0]?.url}
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
                ₦{product.price.toLocaleString("en-NG")}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
