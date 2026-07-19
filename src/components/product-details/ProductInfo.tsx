// components/product/ProductInfo.tsx
import {
  Star,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  Ruler,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  Share2,
} from "lucide-react";
import type { Product, ProductColor } from "../../types/product";
import ColorSelector from "./ColorSelector";

interface ProductInfoProps {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  isWishlisted: boolean;
  addingToCart: boolean;
  onQuantityChange: (delta: number) => void;
  onSizeSelect: (size: string) => void;
  onColorSelect: (color: string) => void;
  onWishlistToggle: () => void;
  onAddToCart: () => void;
  onSizeGuideClick: () => void;
  onShareClick: () => void;
}

const ProductInfo = ({
  product,
  quantity,
  selectedSize,
  selectedColor,
  isWishlisted,
  addingToCart,
  onQuantityChange,
  onSizeSelect,
  onColorSelect,
  onWishlistToggle,
  onAddToCart,
  onSizeGuideClick,
  onShareClick,
}: ProductInfoProps) => {
  const isColorAvailable = (color: ProductColor) => {
    if (!selectedSize) return true;
    return product.variants.some(
      (variant) =>
        variant.color === color.name && variant.sizes.includes(selectedSize),
    );
  };

  // Debug function to check if button is clickable
  const handleAddToCartClick = () => {
    console.log("=== Add to Cart Button Clicked ===");
    console.log("Selected Size:", selectedSize);
    console.log("Selected Color:", selectedColor);
    console.log("Quantity:", quantity);
    console.log("Adding to cart state:", addingToCart);
    console.log("Product:", product.name);

    // Call the parent handler
    onAddToCart();
  };

  return (
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
      <ColorSelector
        colors={product.colors}
        selectedColor={selectedColor}
        isColorAvailable={isColorAvailable}
        onSelect={onColorSelect}
      />

      {/* Size Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium tracking-wide">Size</span>
          <button
            onClick={onSizeGuideClick}
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
              onClick={() => {
                console.log("Size selected:", size);
                onSizeSelect(size);
              }}
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
        <span className="text-sm font-medium tracking-wide">Quantity</span>
        <div className="flex items-center gap-4 border border-gray-300 w-fit">
          <button
            onClick={() => {
              console.log("Decrease quantity");
              onQuantityChange(-1);
            }}
            className="px-4 py-2 hover:bg-gray-50 transition-colors"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center">{quantity}</span>
          <button
            onClick={() => {
              console.log("Increase quantity");
              onQuantityChange(1);
            }}
            className="px-4 py-2 hover:bg-gray-50 transition-colors"
            disabled={quantity >= 10}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="hidden md:block space-y-3 pt-4">
        <button
          onClick={handleAddToCartClick}
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
            onClick={() => {
              console.log("Wishlist toggled");
              onWishlistToggle();
            }}
            className="flex-1 border border-gray-300 py-4 px-8 text-sm uppercase tracking-[0.2em] font-light hover:border-black transition-all flex items-center justify-center gap-2 group"
          >
            <Heart
              className={`w-4 h-4 transition-all ${
                isWishlisted ? "fill-red-500 text-red-500" : ""
              }`}
            />
            Wishlist
          </button>
          <button
            onClick={() => {
              console.log("Share clicked");
              onShareClick();
            }}
            className="flex-1 border border-gray-300 py-4 px-8 text-sm uppercase tracking-[0.2em] font-light hover:border-black transition-all flex items-center justify-center gap-2 group"
          >
            <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Share
          </button>
        </div>
      </div>

      {/* Mobile Action Buttons */}
      <div className="md:hidden space-y-3 pt-4">
        <button
          onClick={handleAddToCartClick}
          disabled={addingToCart}
          className="w-full bg-black text-white py-3 px-6 tracking-[0.2em] text-sm uppercase font-light hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {addingToCart ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Adding...
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              Add to Cart - ₦
              {(product.price * quantity).toLocaleString("en-NG")}
            </>
          )}
        </button>
      </div>

      {/* Shipping & Returns */}
      <div className="border-t border-gray-100 pt-6 space-y-4">
        <div className="flex items-start gap-3">
          <Truck className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Free Shipping</p>
            <p className="text-xs text-gray-500">On all orders over $500</p>
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
            <p className="text-sm font-medium">Authenticity Guaranteed</p>
            <p className="text-xs text-gray-500">100% genuine products</p>
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
              <span className="font-medium">Material:</span> {product.material}
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
  );
};

export default ProductInfo;
