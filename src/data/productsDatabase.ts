import type { Product } from "../types/product";

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
