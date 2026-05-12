// src/data/category-data.ts

// Define types for the category data
export interface CategoryHero {
  title: string;
  subtitle: string;
  video: string;
  fallbackImage: string;
}

export interface CategoryStory {
  title: string;
  description: string;
  quote: string;
}

export interface FeaturedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface Category {
  name: string;
  slug: string;
  hero: CategoryHero;
  story: CategoryStory;
  featured: FeaturedProduct[];
}

// Type for the entire category data object
export type CategoryData = {
  [key: string]: Category;
};

export const categoryData: CategoryData = {
  // New Arrivals
  "new-arrivals": {
    name: "New Arrivals",
    slug: "new-arrivals",
    hero: {
      title: "FRESH PERSPECTIVES",
      subtitle: "New Arrivals",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-43676-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070",
    },
    story: {
      title: "The Latest in Luxury",
      description:
        "Discover our newest creations, where innovation meets timeless elegance. Each piece in our new arrivals collection represents the pinnacle of contemporary design, crafted with the finest materials and the most advanced techniques. From statement pieces to everyday essentials, these fresh additions are destined to become your new favorites.",
      quote: "The new is not just different - it's better.",
    },
    featured: [
      {
        id: 301,
        name: "Autumn Blaze Coat",
        price: 2890,
        image:
          "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1974",
        category: "Outerwear",
      },
      {
        id: 302,
        name: "Crystal Embellished Gown",
        price: 5600,
        image:
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2069",
        category: "Evening Wear",
      },
      {
        id: 303,
        name: "Cashmere Blend Blazer",
        price: 1850,
        image:
          "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=2087",
        category: "Blazer",
      },
      {
        id: 304,
        name: "Silk Midi Dress",
        price: 1290,
        image:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073",
        category: "Dresses",
      },
      {
        id: 305,
        name: "Leather Biker Jacket",
        price: 1590,
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935",
        category: "Outerwear",
      },
      {
        id: 306,
        name: "Pleated Maxi Skirt",
        price: 890,
        image:
          "https://images.unsplash.com/photo-1583496661160-1f6c1b9e47bd?q=80&w=1974",
        category: "Skirts",
      },
      {
        id: 307,
        name: "Oversized Wool Sweater",
        price: 750,
        image:
          "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1974",
        category: "Knitwear",
      },
      {
        id: 308,
        name: "Wide Leg Trousers",
        price: 690,
        image:
          "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?q=80&w=2074",
        category: "Pants",
      },
    ],
  },

  // Atelier
  atelier: {
    name: "Atelier",
    slug: "atelier",
    hero: {
      title: "BESPOKE CRAFTSMANSHIP",
      subtitle: "The Atelier Experience",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-tailor-working-on-suit-43679-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1532635241-cee98161fec4?q=80&w=2072",
    },
    story: {
      title: "The Art of Bespoke Creation",
      description:
        "Step into our atelier, where luxury is not just worn - it's experienced. Here, master artisans bring your vision to life through meticulous craftsmanship and personalized attention. From the first sketch to the final fitting, every detail is tailored to your exact specifications. This is not just clothing - it's a reflection of your unique identity.",
      quote: "True luxury is the freedom to express your individuality.",
    },
    featured: [
      {
        id: 401,
        name: "Bespoke Suit",
        price: 4800,
        image:
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080",
        category: "Tailoring",
      },
      {
        id: 402,
        name: "Custom Wedding Gown",
        price: 8900,
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070",
        category: "Bridal",
      },
      {
        id: 403,
        name: "Hand-Painted Silk Scarf",
        price: 890,
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935",
        category: "Accessories",
      },
      {
        id: 404,
        name: "Made-to-Measure Coat",
        price: 3200,
        image:
          "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1974",
        category: "Outerwear",
      },
      {
        id: 405,
        name: "Custom Leather Goods",
        price: 1250,
        image:
          "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1974",
        category: "Accessories",
      },
      {
        id: 406,
        name: "Bespoke Shirt",
        price: 890,
        image:
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=2070",
        category: "Shirting",
      },
      {
        id: 407,
        name: "Custom Evening Gown",
        price: 7200,
        image:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2083",
        category: "Evening Wear",
      },
      {
        id: 408,
        name: "Personalized Accessories",
        price: 450,
        image:
          "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1974",
        category: "Accessories",
      },
    ],
  },

  // Editorial
  editorial: {
    name: "Editorial",
    slug: "editorial",
    hero: {
      title: "VISUAL STORYTELLING",
      subtitle: "Our Editorial Vision",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-fashion-shoot-43677-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070",
    },
    story: {
      title: "Where Fashion Meets Art",
      description:
        "Our editorial collection showcases the intersection of fashion, art, and culture. Each piece tells a story, capturing the essence of contemporary style through a lens of artistic expression. Here, we push boundaries and challenge conventions, creating wearable art that inspires and captivates.",
      quote: "Fashion is the armor to survive the reality of everyday life.",
    },
    featured: [
      {
        id: 501,
        name: "Artistic Print Dress",
        price: 2450,
        image:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073",
        category: "Dresses",
      },
      {
        id: 502,
        name: "Statement Cape",
        price: 1890,
        image:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936",
        category: "Outerwear",
      },
      {
        id: 503,
        name: "Sculptural Heels",
        price: 1250,
        image:
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080",
        category: "Footwear",
      },
      {
        id: 504,
        name: "Avant-Garde Jumpsuit",
        price: 3200,
        image:
          "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2096",
        category: "Jumpsuits",
      },
    ],
  },

  // Occasions
  wedding: {
    name: "Wedding",
    slug: "wedding",
    hero: {
      title: "ETERNAL ELEGANCE",
      subtitle: "Wedding Collection",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-wedding-dress-details-42769-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070",
    },
    story: {
      title: "Where Dreams Meet Design",
      description:
        "Each piece in our wedding collection is a testament to timeless romance. Crafted from the finest silks and adorned with hand-sewn details, these creations transform your special day into an unforgettable masterpiece. From the first sketch to the final stitch, we honor the profound significance of your celebration.",
      quote: "Love is not just found, it is sewn into every seam.",
    },
    featured: [
      {
        id: 1,
        name: "Celestial Gown",
        price: 4500,
        image:
          "https://images.unsplash.com/photo-1594552072238-92d7b48c4c2f?q=80&w=2070",
        category: "Bridal Gown",
      },
      {
        id: 2,
        name: "Ivory Dreams",
        price: 3800,
        image:
          "https://images.unsplash.com/photo-1525884363673-c593149ceb43?q=80&w=2070",
        category: "Wedding Dress",
      },
      {
        id: 3,
        name: "Pearl Elegance",
        price: 5200,
        image:
          "https://images.unsplash.com/photo-1605891998283-f9e0f6c56f7c?q=80&w=2070",
        category: "Couture Bridal",
      },
      {
        id: 4,
        name: "Royal Lace",
        price: 4100,
        image:
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2069",
        category: "Traditional Gown",
      },
    ],
  },

  dinner: {
    name: "Dinner",
    slug: "dinner",
    hero: {
      title: "EVENING SOPHISTICATION",
      subtitle: "Dinner Collection",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-elegant-woman-in-black-dress-43673-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2070",
    },
    story: {
      title: "The Art of Evening Grace",
      description:
        "When the sun sets and the city lights begin to dance, our dinner collection comes alive. Designed for those who appreciate the subtle power of understated luxury, each piece speaks volumes in whispers. From intimate gatherings to grand soirées, dress not just for the occasion, but for the moment.",
      quote: "Elegance is the only beauty that never fades.",
    },
    featured: [
      {
        id: 5,
        name: "Midnight Silk",
        price: 1800,
        image:
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=2070",
        category: "Evening Dress",
      },
      {
        id: 6,
        name: "Noir Sophistication",
        price: 2200,
        image:
          "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=2069",
        category: "Cocktail Dress",
      },
      {
        id: 7,
        name: "Velvet Nights",
        price: 1950,
        image:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2083",
        category: "Dinner Gown",
      },
      {
        id: 8,
        name: "Satin Grace",
        price: 2400,
        image:
          "https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=2070",
        category: "Evening Wear",
      },
    ],
  },

  lunch: {
    name: "Lunch",
    slug: "lunch",
    hero: {
      title: "DAYTIME REFINEMENT",
      subtitle: "Lunch Collection",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-woman-walking-in-elegant-dress-43675-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070",
    },
    story: {
      title: "Effortless Sophistication by Day",
      description:
        "Our lunch collection embodies the perfect balance between relaxed elegance and refined style. These pieces transition seamlessly from garden parties to business luncheons, always maintaining an air of effortless grace. Lightweight fabrics meet impeccable tailoring in designs that celebrate the beauty of daylight hours.",
      quote: "Style is a way to say who you are without speaking.",
    },
    featured: [
      {
        id: 9,
        name: "Linen Breeze",
        price: 850,
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020",
        category: "Day Dress",
      },
      {
        id: 10,
        name: "Summer Whisper",
        price: 920,
        image:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073",
        category: "Casual Wear",
      },
      {
        id: 11,
        name: "Pastel Dreams",
        price: 780,
        image:
          "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2096",
        category: "Afternoon Dress",
      },
      {
        id: 12,
        name: "Cotton Elegance",
        price: 1050,
        image:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2088",
        category: "Daytime Wear",
      },
    ],
  },

  party: {
    name: "Party",
    slug: "party",
    hero: {
      title: "CELEBRATION IN STYLE",
      subtitle: "Party Collection",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-woman-in-white-dress-on-beach-44380-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070",
    },
    story: {
      title: "Dress for the Celebration",
      description:
        "Whether it's a sophisticated soirée or an intimate gathering, our party collection ensures you make an entrance to remember. Each piece is designed to capture the joy and energy of celebration, with details that sparkle and silhouettes that command attention.",
      quote: "Life is a party, dress like it.",
    },
    featured: [
      {
        id: 25,
        name: "Sequin Dream",
        price: 1500,
        image:
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2069",
        category: "Party Dress",
      },
      {
        id: 26,
        name: "Metallic Glam",
        price: 1300,
        image:
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=2070",
        category: "Evening Gown",
      },
      {
        id: 27,
        name: "Cocktail Shine",
        price: 1100,
        image:
          "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=2069",
        category: "Cocktail Dress",
      },
      {
        id: 28,
        name: "Festive Fantasy",
        price: 1700,
        image:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2083",
        category: "Party Wear",
      },
    ],
  },

  // Women's Collections
  "women-ready-to-wear": {
    name: "Women's Ready-to-Wear",
    slug: "women-ready-to-wear",
    hero: {
      title: "MODERN FEMININITY",
      subtitle: "Women's Ready-to-Wear",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-43676-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070",
    },
    story: {
      title: "The Modern Woman's Wardrobe",
      description:
        "Our ready-to-wear women's collection is a celebration of contemporary femininity. Each piece is designed for the woman who moves through her day with confidence and grace, from boardroom to bistro. Impeccable cuts meet luxurious fabrics in designs that empower without compromise.",
      quote:
        "Fashion is about dressing according to what's fashionable. Style is more about being yourself.",
    },
    featured: [
      {
        id: 17,
        name: "Power Blazer",
        price: 1250,
        image:
          "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=2087",
        category: "Blazer",
      },
      {
        id: 18,
        name: "Silk Blouse",
        price: 680,
        image:
          "https://images.unsplash.com/photo-1564257577054-0e21b5e9c4f6?q=80&w=2070",
        category: "Top",
      },
      {
        id: 19,
        name: "Tailored Trousers",
        price: 890,
        image:
          "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?q=80&w=2074",
        category: "Pants",
      },
      {
        id: 20,
        name: "Cashmere Knit",
        price: 950,
        image:
          "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=2087",
        category: "Knitwear",
      },
    ],
  },

  "women-dresses": {
    name: "Women's Dresses",
    slug: "women-dresses",
    hero: {
      title: "DRESSED FOR ELEGANCE",
      subtitle: "Women's Dresses",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-43676-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073",
    },
    story: {
      title: "The Perfect Silhouette",
      description:
        "From day to night, our dress collection offers the perfect silhouette for every moment. Each style is crafted to celebrate the female form with elegance and sophistication.",
      quote: "A dress is a piece of architecture designed to move gracefully.",
    },
    featured: [
      {
        id: 101,
        name: "Floral Maxi Dress",
        price: 890,
        image:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073",
        category: "Maxi Dress",
      },
      {
        id: 102,
        name: "Little Black Dress",
        price: 750,
        image:
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=2070",
        category: "Cocktail Dress",
      },
      {
        id: 103,
        name: "Wrap Dress",
        price: 680,
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020",
        category: "Day Dress",
      },
      {
        id: 104,
        name: "Evening Gown",
        price: 2200,
        image:
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2069",
        category: "Formal Wear",
      },
    ],
  },

  "women-separates": {
    name: "Women's Separates",
    slug: "women-separates",
    hero: {
      title: "MIX & MASTERPIECE",
      subtitle: "Women's Separates",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-43676-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2096",
    },
    story: {
      title: "Endless Possibilities",
      description:
        "Create your signature look with our versatile separates collection. Mix, match, and master the art of personal style with pieces designed to work together harmoniously.",
      quote: "Style is a way to say who you are without having to speak.",
    },
    featured: [
      {
        id: 105,
        name: "Silk Camisole",
        price: 450,
        image:
          "https://images.unsplash.com/photo-1564257577054-0e21b5e9c4f6?q=80&w=2070",
        category: "Top",
      },
      {
        id: 106,
        name: "Wide Leg Pants",
        price: 590,
        image:
          "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?q=80&w=2074",
        category: "Pants",
      },
      {
        id: 107,
        name: "Cropped Jacket",
        price: 780,
        image:
          "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=2087",
        category: "Jacket",
      },
      {
        id: 108,
        name: "Leather Skirt",
        price: 650,
        image:
          "https://images.unsplash.com/photo-1583496661160-1f6c1b9e47bd?q=80&w=1974",
        category: "Skirt",
      },
    ],
  },

  "women-outerwear": {
    name: "Women's Outerwear",
    slug: "women-outerwear",
    hero: {
      title: "LAYERS OF LUXURY",
      subtitle: "Women's Outerwear",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-43676-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1974",
    },
    story: {
      title: "Elevate Every Layer",
      description:
        "Transform any outfit with our exceptional outerwear collection. From classic trench coats to contemporary capes, each piece is designed to elevate your look while providing timeless elegance.",
      quote:
        "A great coat is like a great friend - always there when you need it.",
    },
    featured: [
      {
        id: 109,
        name: "Wool Cashmere Coat",
        price: 1850,
        image:
          "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1974",
        category: "Coat",
      },
      {
        id: 110,
        name: "Leather Jacket",
        price: 1200,
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935",
        category: "Jacket",
      },
      {
        id: 111,
        name: "Classic Trench",
        price: 890,
        image:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936",
        category: "Trench Coat",
      },
      {
        id: 112,
        name: "Puffer Jacket",
        price: 750,
        image:
          "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=1972",
        category: "Winter Jacket",
      },
    ],
  },

  "women-accessories": {
    name: "Women's Accessories",
    slug: "women-accessories",
    hero: {
      title: "THE FINISHING TOUCH",
      subtitle: "Women's Accessories",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-43676-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935",
    },
    story: {
      title: "Details That Define",
      description:
        "Complete your ensemble with our curated accessories collection. Each piece is thoughtfully designed to add that perfect finishing touch to any outfit.",
      quote: "Accessories are the exclamation point of a woman's outfit.",
    },
    featured: [
      {
        id: 113,
        name: "Silk Scarf",
        price: 250,
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935",
        category: "Scarf",
      },
      {
        id: 114,
        name: "Leather Belt",
        price: 180,
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935",
        category: "Belt",
      },
      {
        id: 115,
        name: "Statement Bag",
        price: 950,
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935",
        category: "Handbag",
      },
      {
        id: 116,
        name: "Cashmere Gloves",
        price: 150,
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935",
        category: "Gloves",
      },
    ],
  },

  // Men's Collections
  "men-ready-to-wear": {
    name: "Men's Ready-to-Wear",
    slug: "men-ready-to-wear",
    hero: {
      title: "CONTEMPORARY MASCULINITY",
      subtitle: "Men's Ready-to-Wear",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-man-in-suit-walking-43678-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071",
    },
    story: {
      title: "Modern Elegance for Men",
      description:
        "Our men's ready-to-wear collection combines classic tailoring with modern sensibilities. Each piece is designed for the discerning gentleman who appreciates quality, fit, and timeless style.",
      quote: "Dress like you're already famous.",
    },
    featured: [
      {
        id: 201,
        name: "Wool Blazer",
        price: 1200,
        image:
          "https://images.unsplash.com/photo-1593030761757-71fae45ca0aa?q=80&w=1964",
        category: "Blazer",
      },
      {
        id: 202,
        name: "Oxford Shirt",
        price: 350,
        image:
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=2070",
        category: "Shirt",
      },
      {
        id: 203,
        name: "Chinos",
        price: 280,
        image:
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1974",
        category: "Pants",
      },
      {
        id: 204,
        name: "Cashmere Sweater",
        price: 650,
        image:
          "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1974",
        category: "Knitwear",
      },
    ],
  },

  "men-tailoring": {
    name: "Men's Tailoring",
    slug: "men-tailoring",
    hero: {
      title: "SARTORIAL EXCELLENCE",
      subtitle: "Men's Tailoring",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-man-in-suit-walking-43678-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071",
    },
    story: {
      title: "The Art of Bespoke Tailoring",
      description:
        "In a world of fast fashion, our tailoring collection stands as a testament to craftsmanship and precision. Each suit is constructed using time-honored techniques, with hand-finished details that distinguish the exceptional from the ordinary. This is more than clothing—it's a legacy of excellence.",
      quote: "A well-tailored suit is to women what lingerie is to men.",
    },
    featured: [
      {
        id: 21,
        name: "Classic Navy Suit",
        price: 2800,
        image:
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080",
        category: "Suit",
      },
      {
        id: 22,
        name: "Charcoal Three-Piece",
        price: 3200,
        image:
          "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=2070",
        category: "Formal Wear",
      },
      {
        id: 23,
        name: "Linen Blazer",
        price: 1450,
        image:
          "https://images.unsplash.com/photo-1593030668969-c0e6d7d8dc1b?q=80&w=2070",
        category: "Jacket",
      },
      {
        id: 24,
        name: "Premium Dress Shirt",
        price: 380,
        image:
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=2070",
        category: "Shirt",
      },
    ],
  },

  "men-casual": {
    name: "Men's Casual",
    slug: "men-casual",
    hero: {
      title: "EFFORTLESS STYLE",
      subtitle: "Men's Casual",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-man-in-suit-walking-43678-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2096",
    },
    story: {
      title: "Refined Relaxation",
      description:
        "Elevate your everyday with our casual collection. Smart, comfortable, and effortlessly stylish - perfect for the modern man who values both comfort and sophistication.",
      quote: "Style is a way to say who you are without having to speak.",
    },
    featured: [
      {
        id: 205,
        name: "Denim Jacket",
        price: 450,
        image:
          "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1974",
        category: "Jacket",
      },
      {
        id: 206,
        name: "Polo Shirt",
        price: 180,
        image:
          "https://images.unsplash.com/photo-1586363104869-3c2e6a5a6c8f?q=80&w=1974",
        category: "Top",
      },
      {
        id: 207,
        name: "Jeans",
        price: 320,
        image:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1926",
        category: "Denim",
      },
      {
        id: 208,
        name: "Hoodie",
        price: 250,
        image:
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974",
        category: "Casual Wear",
      },
    ],
  },

  "men-outerwear": {
    name: "Men's Outerwear",
    slug: "men-outerwear",
    hero: {
      title: "DISTINGUISHED LAYERS",
      subtitle: "Men's Outerwear",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-man-in-suit-walking-43678-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1974",
    },
    story: {
      title: "Define Your Silhouette",
      description:
        "Our outerwear collection combines functionality with sophisticated design. Each piece is crafted to provide warmth without compromising on style.",
      quote: "The right coat makes the man.",
    },
    featured: [
      {
        id: 209,
        name: "Wool Overcoat",
        price: 1650,
        image:
          "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1974",
        category: "Coat",
      },
      {
        id: 210,
        name: "Leather Jacket",
        price: 1100,
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935",
        category: "Jacket",
      },
      {
        id: 211,
        name: "Parka",
        price: 850,
        image:
          "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=1972",
        category: "Winter Coat",
      },
      {
        id: 212,
        name: "Bomber Jacket",
        price: 680,
        image:
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974",
        category: "Jacket",
      },
    ],
  },

  "men-accessories": {
    name: "Men's Accessories",
    slug: "men-accessories",
    hero: {
      title: "THE DISTINGUISHING DETAILS",
      subtitle: "Men's Accessories",
      video:
        "https://assets.mixkit.co/videos/preview/mixkit-man-in-suit-walking-43678-large.mp4",
      fallbackImage:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935",
    },
    story: {
      title: "Elevate Every Ensemble",
      description:
        "Complete your look with our carefully curated accessories. From leather goods to timepieces, each piece adds a touch of refinement to any outfit.",
      quote: "The details are not the details. They make the design.",
    },
    featured: [
      {
        id: 213,
        name: "Leather Wallet",
        price: 250,
        image:
          "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1974",
        category: "Wallet",
      },
      {
        id: 214,
        name: "Silk Tie",
        price: 150,
        image:
          "https://images.unsplash.com/photo-1589756823695-278bc923f962?q=80&w=1974",
        category: "Accessories",
      },
      {
        id: 215,
        name: "Leather Belt",
        price: 180,
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935",
        category: "Belt",
      },
      {
        id: 216,
        name: "Cufflinks",
        price: 120,
        image:
          "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1974",
        category: "Jewelry",
      },
    ],
  },
};

// Helper function to get category by slug - with proper typing
export const getCategoryBySlug = (slug: string): Category | null => {
  return categoryData[slug] || null;
};

// Get all category slugs for routing
export const getAllCategorySlugs = (): string[] => {
  return Object.keys(categoryData);
};

// Get all available categories
export const getAllCategories = (): Category[] => {
  return Object.values(categoryData);
};
