import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Share2,
  ChevronLeft,
  Ruler,
  Star,
  Truck,
  RotateCcw,
  Shield,
  Plus,
  Minus,
  X,
  ChevronRight,
  Check,
  Info,
  Maximize2,
} from "lucide-react";
import DefaultLayout from "../layout/DefaultLayout";
import SimilarProducts from "../components/product/SimilarProducts";
import { toast } from "sonner";

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

// Mock products database - exported for use in other components
export const productsDatabase: { [key: number]: Product } = {
  1: {
    id: 1,
    name: "Celestial Silk Gown",
    price: 2890,
    description:
      "Experience the epitome of elegance with our Celestial Silk Gown. Crafted from the finest Mulberry silk, this masterpiece drapes gracefully, creating an ethereal silhouette that captures light with every movement. The hand-sewn celestial beadwork along the neckline adds a subtle sparkle, making it perfect for evening galas and sophisticated soirees.",
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1628565931779-4f4f0b4f578a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Front view",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1631234764568-996fab371596?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
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
  },
  2: {
    id: 2,
    name: "Midnight Velvet Gown",
    price: 3200,
    description:
      "Luxurious velvet meets timeless elegance in this stunning gown. Perfect for formal events and black-tie occasions.",
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1765991735382-0f9f7da9b44d?q=80&w=926&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Front view",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1594552072238-92d7b48c4c2f?q=80&w=2070",
        alt: "Back view",
      },
    ],
    category: "Evening Wear",
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", code: "#000000" },
      { name: "Navy", code: "#000080" },
    ],
    rating: 4.9,
    reviews: 89,
    inStock: true,
    sku: "MVG-2024-002",
    material: "Luxury Velvet",
    careInstructions: ["Dry clean only", "Do not iron directly"],
    fit: "True to size",
  },
  3: {
    id: 3,
    name: "Sapphire Silk Dress",
    price: 2450,
    description:
      "A stunning sapphire blue dress that commands attention. Perfect for formal events and special occasions.",
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2069",
        alt: "Front view",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=2070",
        alt: "Back view",
      },
    ],
    category: "Evening Wear",
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Sapphire", code: "#0f52ba" },
      { name: "Emerald", code: "#50c878" },
    ],
    rating: 4.7,
    reviews: 94,
    inStock: true,
    sku: "SSD-2024-003",
    material: "Italian Silk",
    careInstructions: ["Dry clean only", "Do not bleach"],
    fit: "True to size",
  },
  4: {
    id: 4,
    name: "Crystal Embellished Gown",
    price: 5600,
    description:
      "Hand-embroidered with Swarovski crystals, this gown is a masterpiece of craftsmanship.",
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=2070",
        alt: "Front view",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1594552072238-92d7b48c4c2f?q=80&w=2070",
        alt: "Detail view",
      },
    ],
    category: "Evening Wear",
    sizes: ["XXS", "XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Clear Crystal", code: "#e8e8e8" },
      { name: "Rose Gold", code: "#b76e79" },
    ],
    rating: 5.0,
    reviews: 45,
    inStock: true,
    sku: "CEG-2024-004",
    material: "Silk Chiffon with Crystal Embellishments",
    careInstructions: [
      "Professional dry clean only",
      "Do not iron directly on crystals",
    ],
    fit: "True to size",
  },
  5: {
    id: 5,
    name: "Pearl White Dress",
    price: 1890,
    description:
      "Elegant pearl white dress perfect for weddings and formal events.",
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1631234764568-996fab371596?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Front view",
      },
    ],
    category: "Evening Wear",
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Pearl White", code: "#f8f0e3" },
      { name: "Ivory", code: "#fff8f0" },
    ],
    rating: 4.6,
    reviews: 112,
    inStock: true,
    sku: "PWD-2024-005",
    material: "Dupioni Silk",
    careInstructions: ["Dry clean only"],
    fit: "True to size",
  },
};

// Cart item interface
interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  sku: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
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
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(true);

  // Refs for sticky elements
  const imageColumnRef = useRef<HTMLDivElement>(null);
  const similarProductsRef = useRef<HTMLDivElement>(null);
  const productInfoEndRef = useRef<HTMLDivElement>(null);

  // Fetch product data based on ID from URL
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      let productId: number;

      if (id && !isNaN(Number(id))) {
        productId = Number(id);
      } else {
        productId = 1;
      }

      const foundProduct = productsDatabase[productId];

      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        const firstProduct = productsDatabase[1];
        if (firstProduct) {
          setProduct(firstProduct);
          console.warn(
            `Product with id ${id} not found, showing fallback product`,
          );
        } else {
          setProduct(null);
        }
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  // Handle scroll to hide/show sticky bar on mobile
  useEffect(() => {
    const handleScroll = () => {
      if (similarProductsRef.current && window.innerWidth < 768) {
        const similarProductsTop = similarProductsRef.current.offsetTop;
        const scrollPosition = window.scrollY + window.innerHeight;

        if (scrollPosition > similarProductsTop) {
          setIsStickyBarVisible(false);
        } else {
          setIsStickyBarVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [product]);

  // Get cart items from localStorage
  const getCart = (): CartItem[] => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  };

  // Save cart to localStorage
  const saveCart = (cart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    // Dispatch event to update cart count in header
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Add to cart function
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }
    if (!product) return;

    setAddingToCart(true);

    const cart = getCart();

    const cartItem: CartItem = {
      id: Date.now(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0].url,
      sku: product.sku,
    };

    // Check if item already exists in cart (same product, size, color)
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.productId === product.id &&
        item.size === cartItem.size &&
        item.color === cartItem.color,
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      cart[existingItemIndex].quantity += quantity;
      saveCart(cart);
      toast.success(`Updated ${product.name} quantity in cart`);
    } else {
      // Add new item
      cart.push(cartItem);
      saveCart(cart);
      toast.success(`${product.name} added to cart`);
    }

    setTimeout(() => {
      setAddingToCart(false);
      setShowCartNotification(true);
      setTimeout(() => setShowCartNotification(false), 3000);
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
              onClick={() => navigate("/")}
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
            {/* Left Column - Image Gallery (Sticky on desktop) */}
            <div
              ref={imageColumnRef}
              className="lg:sticky lg:top-24 lg:self-start space-y-4"
            >
              {/* Main Image */}
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[3/4] overflow-hidden bg-gray-50"
              >
                <img
                  src={
                    product.images[selectedImage]?.url || product.images[0]?.url
                  }
                  alt={product.images[selectedImage]?.alt || product.name}
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
                    ₦{(product.price * quantity).toLocaleString("en-NG")}
                  </span>
                  <span className="text-sm text-gray-400">NGN</span>
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

              {/* Action Buttons - Regular desktop view */}
              <div className="hidden md:block space-y-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full bg-black text-white py-4 px-8 tracking-[0.2em] text-sm uppercase font-light hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Adding to Cart...
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
                        isWishlisted ? "fill-red-500 text-red-500" : ""
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

              {/* Hidden div to track end of product info */}
              <div ref={productInfoEndRef} />
            </div>
          </div>

          {/* Similar Products Section */}
          <div ref={similarProductsRef}>
            <SimilarProducts
              currentProductId={product.id}
              currentCategory={product.category}
              productsDatabase={productsDatabase}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart Button */}
      <AnimatePresence>
        {isStickyBarVisible && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50"
          >
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Total Price</div>
                <div className="text-lg font-medium">
                  ${(product.price * quantity).toLocaleString()}
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 bg-black text-white py-3 px-6 tracking-[0.2em] text-xs uppercase font-light hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {addingToCart ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add
                  </>
                )}
              </button>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="flex-1 border border-gray-300 py-2 text-xs uppercase tracking-[0.2em] font-light hover:border-black transition-all flex items-center justify-center gap-2"
              >
                <Heart
                  className={`w-3 h-3 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                />
                Wishlist
              </button>
              <button className="flex-1 border border-gray-300 py-2 text-xs uppercase tracking-[0.2em] font-light hover:border-black transition-all flex items-center justify-center gap-2">
                <Share2 className="w-3 h-3" />
                Share
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6 overflow-y-auto"
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-light tracking-wide">
                    Size Guide
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Find your perfect fit with our detailed measurements
                  </p>
                </div>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-8">
                {/* How to Measure Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Maximize2 className="w-5 h-5" />
                    How to Measure
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-gray-500">
                          Bust Illustration
                        </span>
                      </div>
                      <p className="font-medium text-sm">Bust</p>
                      <p className="text-xs text-gray-500">
                        Measure around the fullest part of your bust, keeping
                        the tape measure straight across your back.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-gray-500">
                          Waist Illustration
                        </span>
                      </div>
                      <p className="font-medium text-sm">Waist</p>
                      <p className="text-xs text-gray-500">
                        Measure around the narrowest part of your natural waist,
                        typically just above your belly button.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-gray-500">
                          Hips Illustration
                        </span>
                      </div>
                      <p className="font-medium text-sm">Hips</p>
                      <p className="text-xs text-gray-500">
                        Measure around the fullest part of your hips, keeping
                        the tape measure parallel to the floor.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Size Chart */}
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Size Chart (inches)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium">
                            Size
                          </th>
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium">
                            Bust
                          </th>
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium">
                            Waist
                          </th>
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium">
                            Hips
                          </th>
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium">
                            US Size
                          </th>
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium">
                            UK Size
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            size: "XXS",
                            bust: "30-31",
                            waist: "23-24",
                            hips: "32-33",
                            us: "0",
                            uk: "4",
                          },
                          {
                            size: "XS",
                            bust: "32-33",
                            waist: "25-26",
                            hips: "34-35",
                            us: "2",
                            uk: "6",
                          },
                          {
                            size: "S",
                            bust: "34-35",
                            waist: "27-28",
                            hips: "36-37",
                            us: "4-6",
                            uk: "8-10",
                          },
                          {
                            size: "M",
                            bust: "36-37",
                            waist: "29-30",
                            hips: "38-39",
                            us: "8-10",
                            uk: "12-14",
                          },
                          {
                            size: "L",
                            bust: "38-40",
                            waist: "31-33",
                            hips: "40-42",
                            us: "12-14",
                            uk: "16-18",
                          },
                          {
                            size: "XL",
                            bust: "41-43",
                            waist: "34-36",
                            hips: "43-45",
                            us: "16-18",
                            uk: "20-22",
                          },
                          {
                            size: "XXL",
                            bust: "44-46",
                            waist: "37-39",
                            hips: "46-48",
                            us: "20-22",
                            uk: "24-26",
                          },
                        ].map((row) => (
                          <tr key={row.size} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-3 text-sm font-medium">
                              {row.size}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm">
                              {row.bust}"
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm">
                              {row.waist}"
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm">
                              {row.hips}"
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm">
                              {row.us}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm">
                              {row.uk}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tips Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Fit Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                      • If you're between sizes, we recommend sizing up for a
                      comfortable fit.
                    </li>
                    <li>
                      • Our garments are designed with a tailored fit. Please
                      refer to the size chart for accurate measurements.
                    </li>
                    <li>
                      • For custom fittings, our customer service team is
                      available to assist you.
                    </li>
                    <li>
                      • Model is 5'9" (175cm) and wearing size S for reference.
                    </li>
                  </ul>
                </div>

                {/* Need Help */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Need more help? Contact our{" "}
                    <button className="text-black underline hover:no-underline">
                      customer service
                    </button>{" "}
                    for personalized assistance.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Notification */}
      <AnimatePresence>
        {showCartNotification && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-8 right-8 bg-black text-white px-6 py-4 shadow-xl z-50 max-w-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-full">
                <Check className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Added to Cart!</p>
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
