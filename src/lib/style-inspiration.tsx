export const getBrowseStyles = (outfitType: string | null) => {
  const stylesByType: Record<
    string,
    Array<{ id: number; name: string; image: string }>
  > = {
    "native-wear": [
      {
        id: 1,
        name: "Traditional Agbada",
        image:
          "https://images.unsplash.com/photo-1688143029511-b37423aa60a2?q=80&w=986&auto=format&fit=crop",
      },
      {
        id: 2,
        name: "Modern Kaftan",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 3,
        name: "Buba & Sokoto",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 4,
        name: "Embroidered Dashiki",
        image:
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 5,
        name: "Iro ati Buba",
        image:
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 6,
        name: "Senator Style",
        image:
          "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=987&auto=format&fit=crop",
      },
    ],
    corporate: [
      {
        id: 1,
        name: "Power Suit",
        image:
          "https://images.unsplash.com/photo-1763739528420-bdc297ff4ec7?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 2,
        name: "Blazer & Trousers",
        image:
          "https://images.unsplash.com/photo-1580492516014-4a28729eb08a?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 3,
        name: "Corporate Dress",
        image:
          "https://images.unsplash.com/photo-1594938298603-c8148c4b1b8a?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 4,
        name: "Executive Look",
        image:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 5,
        name: "Modern Professional",
        image:
          "https://images.unsplash.com/photo-1507679799861-4569fb64d58c?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 6,
        name: "Business Casual",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=987&auto=format&fit=crop",
      },
    ],
    dresses: [
      {
        id: 1,
        name: "Evening Gown",
        image:
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 2,
        name: "Cocktail Dress",
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 3,
        name: "Maxi Dress",
        image:
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 4,
        name: "Bodycon",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 5,
        name: "A-Line Dress",
        image:
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 6,
        name: "Midi Dress",
        image:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=987&auto=format&fit=crop",
      },
    ],
    suits: [
      {
        id: 1,
        name: "Classic Suit",
        image:
          "https://images.unsplash.com/photo-1507679799861-4569fb64d58c?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 2,
        name: "Tuxedo",
        image:
          "https://images.unsplash.com/photo-1537832816759-23c3b88d5d64?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 3,
        name: "Double-Breasted",
        image:
          "https://images.unsplash.com/photo-1763739528420-bdc297ff4ec7?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 4,
        name: "Slim Fit Suit",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 5,
        name: "Three-Piece Suit",
        image:
          "https://images.unsplash.com/photo-1649532355244-e011eebe7a81?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 6,
        name: "Linen Suit",
        image:
          "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=987&auto=format&fit=crop",
      },
    ],
    casual: [
      {
        id: 1,
        name: "Weekend Look",
        image:
          "https://images.unsplash.com/photo-1614890085618-0e1054da74f8?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 2,
        name: "Smart Casual",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 3,
        name: "Relaxed Fit",
        image:
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 4,
        name: "Summer Style",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 5,
        name: "Streetwear",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 6,
        name: "Loungewear",
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=987&auto=format&fit=crop",
      },
    ],
    wedding: [
      {
        id: 1,
        name: "Bridal Gown",
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 2,
        name: "Groom's Suit",
        image:
          "https://images.unsplash.com/photo-1537832816759-23c3b88d5d64?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 3,
        name: "Bridesmaid Dress",
        image:
          "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 4,
        name: "Mother of Bride/Groom",
        image:
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 5,
        name: "Traditional Wedding",
        image:
          "https://images.unsplash.com/photo-1688143029511-b37423aa60a2?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 6,
        name: "Wedding Guest",
        image:
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=987&auto=format&fit=crop",
      },
    ],
    uniforms: [
      {
        id: 1,
        name: "Corporate Uniform",
        image:
          "https://images.unsplash.com/photo-1654762549162-1f1e6387d67e?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 2,
        name: "School Uniform",
        image:
          "https://images.unsplash.com/photo-1507679799861-4569fb64d58c?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 3,
        name: "Team Wear",
        image:
          "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 4,
        name: "Hospitality Uniform",
        image:
          "https://images.unsplash.com/photo-1594938298603-c8148c4b1b8a?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 5,
        name: "Security Uniform",
        image:
          "https://images.unsplash.com/photo-1763739528420-bdc297ff4ec7?q=80&w=987&auto=format&fit=crop",
      },
      {
        id: 6,
        name: "Medical Wear",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=987&auto=format&fit=crop",
      },
    ],
  };

  return stylesByType[outfitType || ""] || stylesByType["casual"];
};
