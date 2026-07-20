// pages/ProductDetails.tsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import ProductImageGallery from "../components/product-details/ProductImageGallery";
import ProductInfo from "../components/product-details/ProductInfo";
import SizeGuideModal from "../components/product-details/SizeGuideModal";
import AddToCartNotification from "../components/product-details/AddToCartNotification";
import MobileStickyBar from "../components/product-details/MobileStickyBar";
import ProductDetailsSkeleton from "../components/product-details/ProductDetailsSkeleton";
import SimilarProducts from "../components/product/SimilarProducts";
import PageLoadingOverlay from "../components/common/PageLoadingOverlay";
import { toast } from "sonner";
import type { Product } from "../types/product";
import type { ApiProduct } from "../types/api-product";
import { useCart } from "../util/useCart";
import api from "../lib/axios";
import { mapApiProductToProduct } from "../lib/productAdapter";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cartItems, cartCount } = useCart(); // Use addToCart from the hook

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
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
  const [notificationData, setNotificationData] = useState({
    productName: "",
    quantity: 0,
    size: "",
    color: "",
  });

  const similarProductsRef = useRef<HTMLDivElement>(null);

  // Debug: Log cart changes
  useEffect(() => {
    console.log("Cart updated:", cartItems, "Count:", cartCount);
  }, [cartItems, cartCount]);

  // Fetch product data
  useEffect(() => {
    if (!id || !/^[a-f\d]{24}$/i.test(id)) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        const apiProduct: ApiProduct = response.data?.data;
        setProduct(mapApiProductToProduct(apiProduct));

        if (apiProduct.category) {
          try {
            const listResponse = await api.get(`/products`);
            const allProducts: ApiProduct[] = listResponse.data?.data ?? [];
            const similar = allProducts
              .filter(
                (p) =>
                  p.id !== apiProduct.id &&
                  p.category?.id === apiProduct.category?.id,
              )
              .slice(0, 4)
              .map(mapApiProductToProduct);
            setSimilarProducts(similar);
          } catch (similarError) {
            console.log(similarError, "Similar Products Error");
            setSimilarProducts([]);
          }
        } else {
          setSimilarProducts([]);
        }
      } catch (error) {
        console.log(error, "Product Error");
        setProduct(null);
        setSimilarProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle scroll for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (similarProductsRef.current && window.innerWidth < 768) {
        const similarProductsTop = similarProductsRef.current.offsetTop;
        const scrollPosition = window.scrollY + window.innerHeight;
        setIsStickyBarVisible(scrollPosition <= similarProductsTop);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [product]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart using the hook's addToCart function
  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }
    if (!product) {
      toast.error("Product not found");
      return;
    }

    const variant = product.variants.find(
      (v) => v.color === selectedColor && v.sizes.includes(selectedSize),
    );
    if (!variant) {
      toast.error("This size and color combination is unavailable");
      return;
    }

    setAddingToCart(true);

    const success = await addToCart({
      productId: String(product.id),
      variantId: variant.id,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    if (success) {
      setNotificationData({
        productName: product.name,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor,
      });

      setShowCartNotification(true);

      setTimeout(() => {
        setShowCartNotification(false);
      }, 3000);
    }

    setAddingToCart(false);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <>
      <PageLoadingOverlay isLoading={loading} />
      {loading ? (
        <ProductDetailsSkeleton />
      ) : !product ? (
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
      ) : (
        <DefaultLayout>
          <div className="min-h-screen bg-white pt-24 pb-16">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              {/* Back Button */}
              {/* <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm tracking-wide">Back</span>
              </button> */}

              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                <ProductImageGallery
                  images={product.images}
                  productName={product.name}
                  selectedImage={selectedImage}
                  onImageSelect={setSelectedImage}
                />

                <ProductInfo
                  product={product}
                  quantity={quantity}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  isWishlisted={isWishlisted}
                  addingToCart={addingToCart}
                  onQuantityChange={handleQuantityChange}
                  onSizeSelect={setSelectedSize}
                  onColorSelect={setSelectedColor}
                  onWishlistToggle={() => setIsWishlisted(!isWishlisted)}
                  onAddToCart={handleAddToCart}
                  onSizeGuideClick={() => setShowSizeGuide(true)}
                  onShareClick={handleShare}
                />
              </div>

              {/* Similar Products Section */}
              <div ref={similarProductsRef}>
                <SimilarProducts products={similarProducts} />
              </div>
            </div>
          </div>

          <MobileStickyBar
            isVisible={isStickyBarVisible}
            productPrice={product.price}
            quantity={quantity}
            addingToCart={addingToCart}
            isWishlisted={isWishlisted}
            onAddToCart={handleAddToCart}
            onWishlistToggle={() => setIsWishlisted(!isWishlisted)}
            onShareClick={handleShare}
          />

          <SizeGuideModal
            isOpen={showSizeGuide}
            onClose={() => setShowSizeGuide(false)}
          />

          <AddToCartNotification
            isVisible={showCartNotification}
            productName={notificationData.productName}
            quantity={notificationData.quantity}
            size={notificationData.size}
            color={notificationData.color}
            onClose={() => setShowCartNotification(false)}
          />
        </DefaultLayout>
      )}
    </>
  );
};

export default ProductDetails;
