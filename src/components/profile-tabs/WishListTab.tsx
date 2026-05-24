import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { ShoppingCart } from "phosphor-react";

const WishlistTab = () => {
  const wishlistItems = [
    {
      id: 1,
      name: "Silk Maxi Dress",
      price: "$189.00",
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Leather Crossbody Bag",
      price: "$79.00",
      image:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "Oversized Blazer",
      price: "$159.00",
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=100&fit=crop",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {wishlistItems.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center md:gap-5 gap-2 border border-black/10 p-4 hover:border-black/30 transition"
        >
          <div className="item-container md:w-[60%] w-[80%] flex items-center md:gap-5 gap-2">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover"
            />

            <div className="">
              <h4 className="font-medium line-clamp-1 min-w-0 text-black leading-[1rem]">
                {item.name}
              </h4>
              <p className="text-black/60 text-sm mt-1">{item.price}</p>
            </div>
          </div>
          <div className="item-container flex items-center">
            <button className="md:hidden block">
              <ShoppingCart className="w-5 h-5 text-black/30" />
            </button>

            <button className="px-5 md:block hidden py-2 bg-black text-white text-xs uppercase tracking-[0.15em] hover:bg-black/80 transition">
              Add to Cart
            </button>
            <button className="p-2 text-black/30 hover:text-red-500 transition">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default WishlistTab;
