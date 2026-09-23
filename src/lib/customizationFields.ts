// Single source of truth for the Step 4 (Details) question set.
//
// These definitions used to live inside StepCustomization.tsx. They sit here so
// the step component only renders, and so the field rules (which questions are
// shown, what a change invalidates, when the step is complete) can be tested
// without mounting React.
//
// `notes` are the copy shown under a field once an option is picked.
// `icons` are TailoringIcon variant names, used as the fallback whenever the
// sketch for an option has not been drawn yet.

export const OUTFIT_TYPE_IDS = [
  "native-wear",
  "corporate",
  "dresses",
  "suits",
  "casual",
  "wedding",
  "uniforms",
  "other",
] as const;

export type OutfitType = (typeof OUTFIT_TYPE_IDS)[number];
export type Wearer = "men" | "women";
export type Crop = "figure" | "detail";
export type Customizations = Record<string, string>;

export interface FieldDef {
  readonly name: string;
  readonly label: string;
  /** Shorter label for the summary panel, where space is tight. */
  readonly summaryLabel?: string;
  readonly description: string;
  readonly crop: Crop;
  readonly kind?: "sketch" | "swatch";
  readonly required?: boolean;
  readonly options: readonly string[];
  readonly notes?: Readonly<Record<string, string>>;
  readonly icons?: Readonly<Record<string, string>>;
}

export const isOutfitType = (
  value: string | null | undefined,
): value is OutfitType => OUTFIT_TYPE_IDS.some((id) => id === value);

// ── Shared fields ────────────────────────────────────────────────────────────

export const WEARER_FIELD = {
  name: "wearer",
  label: "Who is this for?",
  summaryLabel: "For",
  description:
    "Menswear and womenswear are cut differently, so we ask this first.",
  crop: "figure",
  options: ["Menswear", "Womenswear"],
  notes: {
    Menswear: "Cut on a menswear block, through the chest, waist and shoulder.",
    Womenswear: "Cut on a womenswear block, shaped through the bust and waist.",
  },
  icons: { Menswear: "suitfor-men", Womenswear: "suitfor-women" },
} as const satisfies FieldDef;

export const SUIT_FOR_FIELD = {
  name: "suitFor",
  label: "Who is this for?",
  summaryLabel: "For",
  description:
    "Menswear and womenswear tailoring are built differently enough that we ask this first, so the rest of the choices actually fit.",
  crop: "figure",
  options: ["Men's Tailoring", "Women's Tailoring"],
  notes: {
    "Men's Tailoring":
      "Classic two or three-piece construction: jacket, trouser, optional waistcoat.",
    "Women's Tailoring":
      "Pantsuits, skirt suits, and fitted blazers: cut and finished for a women's silhouette.",
  },
  icons: {
    "Men's Tailoring": "suitfor-men",
    "Women's Tailoring": "suitfor-women",
  },
} as const satisfies FieldDef;

export const FIT_FIELD = {
  name: "fit",
  label: "Fit preference",
  summaryLabel: "Fit",
  description:
    "The dotted line is your body. The drawing shows how much room the garment leaves.",
  crop: "figure",
  options: ["Regular", "Slim", "Relaxed", "Tailored"],
  notes: {
    Regular:
      "Standard fit: comfortable with room to move, suits most body types.",
    Slim: "Closer to the body with minimal excess fabric: clean, modern look.",
    Relaxed: "Loose and airy with extra room: easy, flowing feel.",
    Tailored:
      "Precisely shaped to your measurements: structured and sharp.",
  },
  icons: {
    Regular: "fit-regular",
    Slim: "fit-slim",
    Relaxed: "fit-relaxed",
    Tailored: "fit-tailored",
  },
} as const satisfies FieldDef;

// ── Suits ────────────────────────────────────────────────────────────────────

export const SUIT_FIELDS = {
  men: [
    {
      name: "composition",
      label: "Suit composition",
      summaryLabel: "Composition",
      description:
        "Not every suit is the same number of pieces. Tell us what to make.",
      crop: "figure",
      options: ["Blazer Only", "Two-Piece", "Three-Piece", "Tuxedo"],
      notes: {
        "Blazer Only":
          "Just the jacket. Pair it with trousers you already own.",
        "Two-Piece":
          "Jacket and trouser cut from the same cloth: the standard suit.",
        "Three-Piece":
          "Jacket, trouser, and a matching waistcoat: extra formality and warmth.",
        Tuxedo: "Satin-faced lapels and trim, built for black-tie occasions.",
      },
      icons: {
        "Blazer Only": "composition-blazer",
        "Two-Piece": "composition-two-piece",
        "Three-Piece": "composition-three-piece",
        Tuxedo: "composition-tuxedo",
      },
    },
    {
      name: "lapelStyle",
      label: "Lapel style",
      summaryLabel: "Lapel",
      description:
        "The lapel is the folded flap of fabric on the front of a jacket, just below the collar. It frames your chest and sets the tone of the suit.",
      crop: "detail",
      options: ["Notch", "Peak", "Shawl"],
      notes: {
        Notch:
          "A triangular cut at the collar junction: the most common and versatile style, suits any occasion.",
        Peak: "Points upward toward the shoulder: sharp and formal, often seen on tuxedos and power suits.",
        Shawl:
          "A smooth, uninterrupted curve with no notch: elegant and traditional, popular for dinner jackets.",
      },
      icons: { Notch: "lapel-notch", Peak: "lapel-peak", Shawl: "lapel-shawl" },
    },
    {
      name: "buttons",
      label: "Buttons",
      description:
        "The number and arrangement of buttons on the jacket front.",
      crop: "detail",
      options: ["Two-Button", "Three-Button", "Double-Breasted"],
      notes: {
        "Two-Button":
          "One or both buttons fasten: the most popular choice, versatile for all body types.",
        "Three-Button": "Higher button stance: more conservative and formal.",
        "Double-Breasted":
          "Two parallel rows of buttons: bold, fashion-forward, and very structured.",
      },
      icons: {
        "Two-Button": "buttons-two",
        "Three-Button": "buttons-three",
        "Double-Breasted": "buttons-double-breasted",
      },
    },
    {
      name: "vents",
      label: "Vents",
      description:
        "The vertical slits at the back hem of the jacket, which let you move.",
      crop: "detail",
      options: ["Single Vent", "Double Vent", "No Vent"],
      notes: {
        "Single Vent":
          "One center slit: classic American style, casual and easy.",
        "Double Vent":
          "Two side slits: allows more movement and drapes cleanly when seated.",
        "No Vent": "A clean, uninterrupted back: very formal and structured.",
      },
      icons: {
        "Single Vent": "vent-single",
        "Double Vent": "vent-double",
        "No Vent": "vent-none",
      },
    },
    {
      name: "pockets",
      label: "Pockets",
      description: "The hip pocket finish on the lower front of the jacket.",
      crop: "detail",
      options: ["Flap", "Jetted", "Patch", "Ticket"],
      notes: {
        Flap: "A fabric flap covers the pocket opening: practical, classic, and the most common.",
        Jetted:
          "Thin horizontal slit with no flap: sleek, minimalist, and very formal.",
        Patch:
          "A pocket sewn on top of the fabric: casual and relaxed, great for sport coats.",
        Ticket:
          "A small extra pocket on the right hip: traditionally used for train tickets.",
      },
      icons: {
        Flap: "pocket-flap",
        Jetted: "pocket-jetted",
        Patch: "pocket-patch",
        Ticket: "pocket-ticket",
      },
    },
  ],
  women: [
    {
      name: "composition",
      label: "Suit composition",
      summaryLabel: "Composition",
      description:
        "Not every suit is the same number of pieces. Tell us what to make.",
      crop: "figure",
      options: ["Blazer Only", "Pantsuit", "Skirt Suit", "Three-Piece"],
      notes: {
        "Blazer Only": "Just the jacket. Style it with what you already own.",
        Pantsuit: "Jacket and tailored trouser, cut from the same cloth.",
        "Skirt Suit": "Jacket and a matching tailored skirt.",
        "Three-Piece":
          "Jacket, a bottom of your choice, and a fitted waistcoat.",
      },
      icons: {
        "Blazer Only": "composition-blazer",
        Pantsuit: "composition-pantsuit",
        "Skirt Suit": "composition-skirt-suit",
        "Three-Piece": "composition-three-piece-women",
      },
    },
    {
      name: "silhouette",
      label: "Jacket silhouette",
      summaryLabel: "Silhouette",
      description:
        "The overall shape of the jacket through the body: how closely it follows your waist.",
      crop: "figure",
      options: ["Fitted Waist", "Boxy", "Peplum", "Cropped"],
      notes: {
        "Fitted Waist":
          "Nipped in at the waist for a defined, tailored shape.",
        Boxy: "Straight through the body with no waist shaping, relaxed and modern.",
        Peplum:
          "Fitted through the bust and waist, then flares out just below: feminine and structured.",
        Cropped:
          "Ends above the hip, worn high-waisted: shows a little more of what's underneath.",
      },
      icons: {
        "Fitted Waist": "silhouette-fitted",
        Boxy: "silhouette-boxy",
        Peplum: "silhouette-peplum",
        Cropped: "silhouette-cropped",
      },
    },
    {
      name: "lapelStyle",
      label: "Lapel style",
      summaryLabel: "Lapel",
      description:
        "The lapel is the folded flap of fabric on the front of a jacket, just below the collar. It frames your chest and sets the tone of the look.",
      crop: "detail",
      options: ["Notch", "Peak", "Shawl", "Collarless"],
      notes: {
        Notch:
          "A triangular cut at the collar junction: versatile, works for any occasion.",
        Peak: "Points upward toward the shoulder: sharp, formal, and fashion-forward.",
        Shawl:
          "A smooth, uninterrupted curve with no notch: elegant and soft.",
        Collarless:
          "No lapel at all: a clean, modern neckline with nothing to fold.",
      },
      icons: {
        Notch: "lapel-notch",
        Peak: "lapel-peak",
        Shawl: "lapel-shawl",
        Collarless: "lapel-collarless",
      },
    },
    {
      name: "buttons",
      label: "Closure",
      description: "How the front of the jacket fastens.",
      crop: "detail",
      options: ["Single-Breasted", "Double-Breasted", "Open Front"],
      notes: {
        "Single-Breasted": "One column of buttons, clean and versatile.",
        "Double-Breasted":
          "Two parallel rows of buttons, bold and structured.",
        "Open Front": "No buttons at all: worn open over what's underneath.",
      },
      icons: {
        "Single-Breasted": "buttons-single-breasted",
        "Double-Breasted": "buttons-double-breasted",
        "Open Front": "buttons-open-front",
      },
    },
    {
      name: "pockets",
      label: "Pockets",
      description: "The hip pocket finish on the lower front of the jacket.",
      crop: "detail",
      options: ["Flap", "Jetted", "Patch", "No Pockets"],
      notes: {
        Flap: "A fabric flap covers the pocket opening, practical and classic.",
        Jetted: "Thin horizontal slit with no flap, sleek and minimalist.",
        Patch: "A pocket sewn on top of the fabric, casual and relaxed.",
        "No Pockets":
          "A clean, uninterrupted front with no pocket detailing.",
      },
      icons: {
        Flap: "pocket-flap",
        Jetted: "pocket-jetted",
        Patch: "pocket-patch",
        "No Pockets": "pocket-none",
      },
    },
  ],
} as const satisfies Record<Wearer, readonly FieldDef[]>;

/**
 * Suit detail fields are reused between the men's and women's option sets, but
 * their option values differ: switching who the suit is for invalidates
 * whatever was picked downstream, so those answers are cleared.
 */
const SUIT_DEPENDENT = new Set([
  "composition",
  "lapelStyle",
  "buttons",
  "vents",
  "pockets",
  "silhouette",
]);

// ── Everything else ──────────────────────────────────────────────────────────

export const OUTFIT_FIELDS = {
  "native-wear": [
    {
      name: "neckStyle",
      label: "Neckline",
      description: "Where the garment opens at the neck.",
      crop: "detail",
      options: ["Round", "V-Neck", "Mandarin", "Traditional"],
      notes: {
        Round: "A simple circular neckline, classic and versatile.",
        "V-Neck": "A V-shaped opening at the front, elongates the neck.",
        Mandarin: "A short, raised collar with no fold: clean and refined.",
        Traditional:
          "Classic Nigerian collar with embroidered trim at the edge.",
      },
      icons: {
        Round: "neck-round",
        "V-Neck": "neck-vneck",
        Mandarin: "neck-mandarin",
        Traditional: "neck-traditional",
      },
    },
    {
      name: "sleeveType",
      label: "Sleeves",
      description: "The length and cut of the sleeves on your top or buba.",
      crop: "detail",
      options: ["Short", "Long", "3/4", "Sleeveless"],
      notes: {
        Short: "Ends at the upper arm, cool and casual.",
        Long: "Full-length sleeve to the wrist, formal and traditional.",
        "3/4": "Falls between the elbow and wrist: a versatile middle ground.",
        Sleeveless: "No sleeves: open at the shoulder.",
      },
      icons: {
        Short: "sleeve-short",
        Long: "sleeve-long",
        "3/4": "sleeve-3-4",
        Sleeveless: "sleeveless",
      },
    },
    {
      name: "embroidery",
      label: "Embroidery",
      description: "How much handwork goes into the collar, cuffs and chest.",
      crop: "detail",
      options: ["None", "Minimal", "Traditional", "Premium"],
      notes: {
        None: "No embroidery: a clean, minimalist finish.",
        Minimal: "Subtle stitching around the neckline or cuffs only.",
        Traditional:
          "Classic Nigerian motifs: Aso-oke or Ankara-style patterns.",
        Premium:
          "Heavy, intricate gold or silver thread embroidery with full coverage.",
      },
      icons: {
        None: "embroidery-none",
        Minimal: "embroidery-minimal",
        Traditional: "embroidery-traditional",
        Premium: "embroidery-premium",
      },
    },
    {
      name: "trouserStyle",
      label: "Trousers",
      description: "The cut and silhouette of your sokoto.",
      crop: "figure",
      options: ["Straight", "Tapered", "Flared", "Drawstring"],
      notes: {
        Straight: "Same width from hip to ankle, timeless and versatile.",
        Tapered: "Gradually narrows toward the ankle, modern and clean.",
        Flared: "Widens below the knee, bold and traditional.",
        Drawstring: "Elastic or tied waist, relaxed and comfortable.",
      },
      icons: {
        Straight: "trouser-straight",
        Tapered: "trouser-tapered",
        Flared: "trouser-flared",
        Drawstring: "trouser-drawstring",
      },
    },
    {
      name: "capStyle",
      label: "Cap",
      description:
        "An optional traditional cap to complete the look. Tap again to remove.",
      crop: "detail",
      required: false,
      options: ["None", "Fila", "Okpu Agu", "Songhai", "Kofia", "Other"],
      notes: {
        None: "No cap, outfit only.",
        Fila: "Yoruba round cap: soft, often embroidered. Can be worn tilted or straight.",
        "Okpu Agu":
          "Igbo eagle feather cap: a symbol of honour, status and bravery.",
        Songhai:
          "Northern Nigerian flat cap, also called Kube: simple and dignified.",
        Kofia:
          "Round white cap common in West African Muslim culture, modest and clean.",
        Other:
          "Have something specific in mind? Describe it in your notes at checkout.",
      },
      icons: {
        None: "cap-none",
        Fila: "cap-fila",
        "Okpu Agu": "cap-okpu-agu",
        Songhai: "cap-songhai",
        Kofia: "cap-kofia",
        Other: "cap-other",
      },
    },
  ],
  dresses: [
    {
      name: "neckline",
      label: "Neckline",
      description: "The shape of the fabric edge around the neck and chest.",
      crop: "detail",
      options: ["Sweetheart", "V-Neck", "High Neck", "Off-Shoulder", "Halter"],
      notes: {
        Sweetheart:
          "Curved, heart-shaped dip at the center: romantic and feminine.",
        "V-Neck":
          "A pointed V-shape: elongates the neck and flatters most body types.",
        "High Neck":
          "Covers the base of the neck: elegant, modest, and sophisticated.",
        "Off-Shoulder":
          "Sits below both shoulders exposing the collarbone, flirty and stylish.",
        Halter:
          "Strap ties around the neck with an open or low back, bold and summery.",
      },
      icons: {
        Sweetheart: "neckline-sweetheart",
        "V-Neck": "neck-vneck",
        "High Neck": "neckline-highneck",
        "Off-Shoulder": "neckline-offshoulder",
        Halter: "neckline-halter",
      },
    },
    {
      name: "sleeveType",
      label: "Sleeves",
      description: "The style and length of the sleeves.",
      crop: "detail",
      options: ["Sleeveless", "Short", "Long", "Puff", "Bell"],
      notes: {
        Sleeveless: "No sleeves, clean and modern.",
        Short: "Ends at the upper arm, light and casual.",
        Long: "Full length to the wrist, elegant and modest.",
        Puff: "Gathered and inflated at the shoulder, dramatic and fashion-forward.",
        Bell: "Fitted at the top, flaring wide at the elbow or wrist: bohemian and graceful.",
      },
      icons: {
        Sleeveless: "sleeveless",
        Short: "sleeve-short",
        Long: "sleeve-long",
        Puff: "sleeve-puff",
        Bell: "sleeve-bell",
      },
    },
    {
      name: "length",
      label: "Length",
      description: "Where the hem of the dress falls on your body.",
      crop: "figure",
      options: ["Mini", "Knee", "Midi", "Maxi"],
      notes: {
        Mini: "Falls mid-thigh, bold and youthful.",
        Knee: "Ends at or just below the knee, classic and versatile.",
        Midi: "Falls between the knee and ankle, elegant and modest.",
        Maxi: "Floor-length: dramatic, flowing, and formal.",
      },
      icons: {
        Mini: "length-mini",
        Knee: "length-knee",
        Midi: "length-midi",
        Maxi: "length-maxi",
      },
    },
    {
      name: "silhouette",
      label: "Silhouette",
      description:
        "The overall shape of the dress: how it fits and flows from shoulder to hem.",
      crop: "figure",
      options: ["A-Line", "Sheath", "Mermaid", "Ball Gown", "Empire"],
      notes: {
        "A-Line":
          "Fitted at the hips and flaring outward like an A, universally flattering.",
        Sheath:
          "Straight and slim from shoulder to hem: sleek, modern, and professional.",
        Mermaid:
          "Fitted through the body and flaring dramatically at the knee, bold and sexy.",
        "Ball Gown":
          "Fitted bodice with a full, voluminous skirt from the waist: the princess silhouette.",
        Empire:
          "High waistline just below the bust with a flowing skirt, romantic and relaxed.",
      },
      icons: {
        "A-Line": "dress-silhouette-aline",
        Sheath: "dress-silhouette-sheath",
        Mermaid: "dress-silhouette-mermaid",
        "Ball Gown": "dress-silhouette-ballgown",
        Empire: "dress-silhouette-empire",
      },
    },
  ],
  corporate: [
    {
      name: "jacketStyle",
      label: "Jacket style",
      summaryLabel: "Jacket",
      description: "How the front of the jacket closes.",
      crop: "detail",
      options: ["Single-Breasted", "Double-Breasted"],
      notes: {
        "Single-Breasted":
          "One row of buttons: clean, versatile, and the most common choice.",
        "Double-Breasted":
          "Two overlapping rows of buttons: structured, authoritative, and fashion-forward.",
      },
      icons: {
        "Single-Breasted": "buttons-single-breasted",
        "Double-Breasted": "buttons-double-breasted",
      },
    },
    {
      name: "skirtOrTrousers",
      label: "Skirt or trousers",
      summaryLabel: "Bottoms",
      description: "What we pair with the jacket.",
      crop: "figure",
      options: ["Skirt", "Trousers", "Both"],
      notes: {
        Skirt: "A tailored skirt, classic and professional.",
        Trousers: "Tailored pants: modern, powerful, and comfortable.",
        Both: "We'll make both so you can mix and match.",
      },
    },
    {
      name: "color",
      label: "Colour",
      description: "The base colour of your corporate outfit.",
      crop: "detail",
      kind: "swatch",
      options: ["Black", "Navy", "Charcoal", "Beige", "Burgundy"],
      notes: {
        Black: "Timeless and versatile: works for any corporate setting.",
        Navy: "Professional and approachable: slightly softer than black.",
        Charcoal: "Dark gray tone, sophisticated and serious.",
        Beige: "Warm neutral: great for daytime and lighter seasons.",
        Burgundy: "Deep wine red, bold yet professional.",
      },
    },
  ],
  wedding: [
    {
      name: "role",
      label: "Your role",
      summaryLabel: "Role",
      description:
        "Helps us style the outfit appropriately for your part in the ceremony.",
      crop: "figure",
      options: ["Bride", "Groom", "Bridesmaid", "Groomsman", "Mother", "Guest"],
      notes: {
        Bride: "The focus of the event: we'll give this the full bridal treatment.",
        Groom: "Sharp, classic, and complementary to the bridal theme.",
        Bridesmaid:
          "Coordinated with the bridal party, elegant and harmonious.",
        Groomsman: "Coordinated with the groom, polished and uniform.",
        Mother: "Dignified and celebratory, befitting the occasion.",
        Guest: "Elegant and respectful of the event's dress code.",
      },
    },
    {
      name: "formality",
      label: "Formality",
      description: "The overall tone and dress code of the wedding.",
      crop: "figure",
      options: ["Formal", "Semi-Formal", "Casual"],
      notes: {
        Formal:
          "Black tie or white tie: gowns, tuxedos, full traditional regalia.",
        "Semi-Formal":
          "Cocktail or smart-casual: suits, midi dresses, aso-ebi styles.",
        Casual:
          "Relaxed and comfortable: still elegant but without strict rules.",
      },
    },
    {
      name: "colorScheme",
      label: "Colour scheme",
      summaryLabel: "Colours",
      description:
        "The palette to align with the wedding's theme or aso-ebi colour.",
      crop: "detail",
      kind: "swatch",
      options: ["White/Ivory", "Pastel", "Bold", "Traditional"],
      notes: {
        "White/Ivory": "Classic bridal palette: pure white or warm ivory tones.",
        Pastel: "Soft blush, mint, lavender, light and romantic.",
        Bold: "Rich, saturated colours: navy, burgundy, emerald, gold.",
        Traditional:
          "Aso-ebi fabric and colours as directed by the family.",
      },
    },
  ],
  casual: [],
  uniforms: [],
  other: [],
} as const satisfies Record<Exclude<OutfitType, "suits">, readonly FieldDef[]>;

// ── Rules ────────────────────────────────────────────────────────────────────

export function wearerFromSuitFor(
  value: string | undefined,
): Wearer | undefined {
  if (value === "Men's Tailoring") return "men";
  if (value === "Women's Tailoring") return "women";
  return undefined;
}

export function wearerFromLabel(value: string | undefined): Wearer | undefined {
  if (value === "Menswear") return "men";
  if (value === "Womenswear") return "women";
  return undefined;
}

export function deriveWearer(
  outfitType: OutfitType,
  values: Customizations,
): Wearer | undefined {
  if (outfitType === "suits") return wearerFromSuitFor(values.suitFor);
  if (outfitType === "dresses") return "women";
  return wearerFromLabel(values.wearer);
}

/** Fields in display order. Suits reveal the rest only after suitFor is chosen. */
export function getFields(
  outfitType: OutfitType,
  values: Customizations,
): readonly FieldDef[] {
  if (outfitType === "suits") {
    const wearer = wearerFromSuitFor(values.suitFor);
    return wearer
      ? [SUIT_FOR_FIELD, FIT_FIELD, ...SUIT_FIELDS[wearer]]
      : [SUIT_FOR_FIELD];
  }
  if (outfitType === "dresses") return [FIT_FIELD, ...OUTFIT_FIELDS.dresses];
  return [WEARER_FIELD, FIT_FIELD, ...OUTFIT_FIELDS[outfitType]];
}

export function applySelection(
  values: Customizations,
  name: string,
  option: string,
): Customizations {
  if (name === "suitFor" && values.suitFor !== option) {
    const kept = Object.entries(values).filter(
      ([key]) => !SUIT_DEPENDENT.has(key),
    );
    return { ...Object.fromEntries(kept), suitFor: option };
  }
  return { ...values, [name]: option };
}

export const clearField = (
  values: Customizations,
  name: string,
): Customizations =>
  Object.fromEntries(Object.entries(values).filter(([key]) => key !== name));

export const isComplete = (
  fields: readonly FieldDef[],
  values: Customizations,
): boolean =>
  fields.every(
    (field) => field.required === false || Boolean(values[field.name]),
  );

/** Drops answers to fields that are no longer shown, so stale values never reach the order. */
export const pickVisible = (
  fields: readonly FieldDef[],
  values: Customizations,
): Customizations =>
  Object.fromEntries(
    fields.flatMap((field): [string, string][] => {
      const value = values[field.name];
      return value ? [[field.name, value]] : [];
    }),
  );
