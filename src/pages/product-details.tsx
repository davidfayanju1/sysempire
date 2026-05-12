import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Ruler,
  Star,
  Truck,
  RotateCcw,
  Shield,
  Plus,
  Minus,
  X,
} from "lucide-react";
import DefaultLayout from "../layout/DefaultLayout";

// Types
interface ProductImage {
  id: number;
  url: string;
  alt: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: ProductImage[];
  category: string;
  sizes: string[];
  colors: { name: string; code: string; image?: string }[];
  rating: number;
  reviews: number;
  inStock: boolean;
  sku: string;
  material: string;
  careInstructions: string[];
  fit: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  // Mock product data - replace with API call
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const mockProduct: Product = {
        id: Number(id) || 1,
        name: "Celestial Silk Gown",
        price: 2890,
        description:
          "Experience the epitome of elegance with our Celestial Silk Gown. Crafted from the finest Mulberry silk, this masterpiece drapes gracefully, creating an ethereal silhouette that captures light with every movement. The hand-sewn celestial beadwork along the neckline adds a subtle sparkle, making it perfect for evening galas and sophisticated soirees.",
        images: [
          {
            id: 1,
            url: "https://images.unsplash.com/photo-1594552072238-92d7b48c4c2f?q=80&w=2070",
            alt: "Front view",
          },
          {
            id: 2,
            url: "https://images.unsplash.com/photo-1525884363673-c593149ceb43?q=80&w=2070",
            alt: "Back view",
          },
          {
            id: 3,
            url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2069",
            alt: "Detail view",
          },
          {
            id: 4,
            url: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=2070",
            alt: "Side view",
          },
        ],
        category: "Evening Wear",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: [
          {
            name: "Midnight Blue",
            code: "#1a2332",
            image:
              "https://images.unsplash.com/photo-1594552072238-92d7b48c4c2f?q=80&w=2070",
          },
          {
            name: "Blush Pink",
            code: "#f5e6e8",
            image:
              "https://images.unsplash.com/photo-1525884363673-c593149ceb43?q=80&w=2070",
          },
          {
            name: "Ivory",
            code: "#fff8f0",
            image:
              "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2069",
          },
        ],
        rating: 4.8,
        reviews: 127,
        inStock: true,
        sku: "CSG-2024-001",
        material: "100% Mulberry Silk",
        careInstructions: [
          "Dry clean only",
          "Do not bleach",
          "Iron on low heat",
          "Store in garment bag",
        ],
        fit: "True to size, model is 5'9\" wearing size S",
      };
      setProduct(mockProduct);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    if (!selectedColor) {
      alert("Please select a color");
      return;
    }

    setAddingToCart(true);

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Add new item
    const cartItem = {
      id: product?.id,
      name: product?.name,
      price: product?.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      image: product?.images[0].url,
      sku: product?.sku,
    };

    existingCart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Dispatch custom event to update cart count in Nav
    window.dispatchEvent(new Event("cartUpdated"));

    setTimeout(() => {
      setAddingToCart(false);
      setShowAddedToCart(true);
      setTimeout(() => setShowAddedToCart(false), 3000);
    }, 500);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            <p className="text-gray-500 font-light tracking-wide">Loading...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (!product) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-light mb-4">Product Not Found</h2>
            <button
              onClick={() => navigate("/product")}
              className="text-black border-b border-black pb-1 hover:opacity-70 transition-opacity"
            >
              Return to Shop
            </button>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm tracking-wide">Back</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[3/4] overflow-hidden bg-gray-50"
              >
                <img
                  src={product.images[selectedImage].url}
                  alt={product.images[selectedImage].alt}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Thumbnail Navigation */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 overflow-hidden bg-gray-50 transition-all ${
                      selectedImage === index
                        ? "ring-2 ring-black ring-offset-2"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-8">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-400 tracking-wide">
                <span className="hover:text-black cursor-pointer transition-colors">
                  Collections
                </span>
                {" / "}
                <span className="hover:text-black cursor-pointer transition-colors">
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl md:text-4xl font-light mb-3 tracking-wide">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-light tracking-wide">
                    ${product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400">USD</span>
                </div>
                {product.inStock && (
                  <span className="inline-block mt-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    In Stock
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium tracking-wide">
                    Color
                  </span>
                  <span className="text-sm text-gray-500">
                    {selectedColor || "Select a color"}
                  </span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className="relative group"
                    >
                      <div
                        className={`w-12 h-12 rounded-full transition-all ${
                          selectedColor === color.name
                            ? "ring-2 ring-black ring-offset-2"
                            : "ring-1 ring-gray-200 hover:ring-gray-400"
                        }`}
                        style={{ backgroundColor: color.code }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {color.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium tracking-wide">
                    Size
                  </span>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors"
                  >
                    <Ruler className="w-3 h-3" />
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[60px] h-12 px-4 border transition-all ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black text-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <span className="text-sm font-medium tracking-wide">
                  Quantity
                </span>
                <div className="flex items-center gap-4 border border-gray-300 w-fit">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-4 py-2 hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-4 py-2 hover:bg-gray-50 transition-colors"
                    disabled={quantity >= 10}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full bg-black text-white py-4 px-8 tracking-[0.2em] text-sm uppercase font-light hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="flex-1 border border-gray-300 py-4 px-8 text-sm uppercase tracking-[0.2em] font-light hover:border-black transition-all flex items-center justify-center gap-2 group"
                  >
                    <Heart
                      className={`w-4 h-4 transition-all ${
                        isWishlisted
                          ? "fill-red-500 text-red-500"
                          : "group-hover:text-red-500"
                      }`}
                    />
                    Wishlist
                  </button>
                  <button className="flex-1 border border-gray-300 py-4 px-8 text-sm uppercase tracking-[0.2em] font-light hover:border-black transition-all flex items-center justify-center gap-2 group">
                    <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Share
                  </button>
                </div>
              </div>

              {/* Shipping & Returns */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Free Shipping</p>
                    <p className="text-xs text-gray-500">
                      On all orders over $500
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">14-Day Returns</p>
                    <p className="text-xs text-gray-500">
                      Hassle-free returns within 14 days
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      Authenticity Guaranteed
                    </p>
                    <p className="text-xs text-gray-500">
                      100% genuine products
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Details Accordion */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none py-2">
                    <span className="text-sm font-medium tracking-wide">
                      Product Details
                    </span>
                    <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="pt-4 space-y-3 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">SKU:</span> {product.sku}
                    </p>
                    <p>
                      <span className="font-medium">Material:</span>{" "}
                      {product.material}
                    </p>
                    <p>
                      <span className="font-medium">Fit:</span> {product.fit}
                    </p>
                  </div>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none py-2">
                    <span className="text-sm font-medium tracking-wide">
                      Care Instructions
                    </span>
                    <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="pt-4">
                    <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                      {product.careInstructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6"
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-lg w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-light tracking-wide">Size Guide</h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="font-medium">Size</div>
                  <div className="font-medium">Bust</div>
                  <div className="font-medium">Waist</div>
                  <div className="font-medium">Hips</div>
                  {[
                    {
                      size: "XS",
                      bust: "30-32",
                      waist: "24-26",
                      hips: "33-35",
                    },
                    { size: "S", bust: "32-34", waist: "26-28", hips: "35-37" },
                    { size: "M", bust: "34-36", waist: "28-30", hips: "37-39" },
                    { size: "L", bust: "36-38", waist: "30-32", hips: "39-41" },
                    {
                      size: "XL",
                      bust: "38-40",
                      waist: "32-34",
                      hips: "41-43",
                    },
                  ].map((row) => (
                    <>
                      <div className="text-gray-600">{row.size}</div>
                      <div className="text-gray-600">{row.bust}"</div>
                      <div className="text-gray-600">{row.waist}"</div>
                      <div className="text-gray-600">{row.hips}"</div>
                    </>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Measurements are in inches. Model is 5'9" wearing size S.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Added to Cart Notification */}
      <AnimatePresence>
        {showAddedToCart && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-black text-white px-6 py-4 shadow-xl z-50 max-w-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Added to Cart</p>
                <p className="text-xs text-gray-300 mt-1">
                  {quantity} × {product.name} - {selectedSize} / {selectedColor}
                </p>
              </div>
              <button
                onClick={() => navigate("/cart")}
                className="text-xs uppercase tracking-wider border-b border-white pb-1 hover:opacity-70 transition-opacity"
              >
                View Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DefaultLayout>
  );
};

export default ProductDetails;
