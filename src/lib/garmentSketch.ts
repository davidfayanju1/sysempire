// Builds the live croquis drawn in the Step 4 summary panel.
//
// Everything here is pure geometry in a 300 x 500 viewBox: given the outfit
// type, the wearer and the answers so far, it returns the body figure and the
// garment pieces laid over it. The component only renders what it returns, so
// the drawing rules can be read (and tested) without React.
//
// Coordinates are chosen against a ~9-head fashion croquis: shoulders at y=100,
// waist at 205, hips at 255, ankles at 465.
import type { Customizations, OutfitType, Wearer } from "./customizationFields";

const CENTER = 150;
const SHOULDER_Y = 100;
const CHEST_Y = 150;
const WAIST_Y = 205;
const HIP_Y = 255;
const KNEE_Y = 365;
const ANKLE_Y = 465;

interface Block {
  shoulder: number;
  chest: number;
  waist: number;
  hip: number;
  headR: number;
  headY: number;
}

const BLOCKS: Record<Wearer, Block> = {
  women: { shoulder: 30, chest: 27, waist: 21, hip: 32, headR: 20, headY: 55 },
  men: { shoulder: 37, chest: 33, waist: 28, hip: 30, headR: 22, headY: 57 },
};

/** How much room the garment leaves over the body, per fit answer. */
const EASE: Record<string, { body: number; waist: number }> = {
  Slim: { body: 2, waist: 1 },
  Regular: { body: 5, waist: 5 },
  Relaxed: { body: 11, waist: 12 },
  Tailored: { body: 3, waist: 0 },
};

const DRESS_HEM: Record<string, number> = {
  Mini: 300,
  Knee: 355,
  Midi: 410,
  Maxi: ANKLE_Y,
};

export interface SketchPiece {
  d: string;
  /** Hairline detail rather than a garment edge, drawn thinner. */
  detail?: boolean;
  /** Filled with the faint accent wash, to read as cloth. */
  filled?: boolean;
  dashed?: boolean;
}

export interface GarmentSketch {
  head: { cx: number; cy: number; r: number };
  body: string[];
  pieces: SketchPiece[];
  /** Horizontal guides, drawn dashed like a design sheet. */
  guides: { y: number; half: number }[];
}

const mirror = (half: number) => [CENTER - half, CENTER + half] as const;

// ── Body ─────────────────────────────────────────────────────────────────────

function bodyPaths(block: Block): string[] {
  const [sl, sr] = mirror(block.shoulder);
  const [wl, wr] = mirror(block.waist);
  const [hl, hr] = mirror(block.hip);

  return [
    // neck
    `M${CENTER - 6},${block.headY + block.headR - 2} L${CENTER - 7},${SHOULDER_Y - 4} M${CENTER + 6},${block.headY + block.headR - 2} L${CENTER + 7},${SHOULDER_Y - 4}`,
    // shoulder line
    `M${sl},${SHOULDER_Y} Q${CENTER},${SHOULDER_Y - 9} ${sr},${SHOULDER_Y}`,
    // torso sides
    `M${sl},${SHOULDER_Y} Q${sl - 2},${CHEST_Y} ${wl},${WAIST_Y} Q${hl - 1},${HIP_Y - 20} ${hl},${HIP_Y}`,
    `M${sr},${SHOULDER_Y} Q${sr + 2},${CHEST_Y} ${wr},${WAIST_Y} Q${hr + 1},${HIP_Y - 20} ${hr},${HIP_Y}`,
    // arms
    `M${sl},${SHOULDER_Y + 2} Q${sl - 12},${WAIST_Y} ${sl - 8},${HIP_Y + 20}`,
    `M${sr},${SHOULDER_Y + 2} Q${sr + 12},${WAIST_Y} ${sr + 8},${HIP_Y + 20}`,
    // legs
    `M${hl},${HIP_Y} Q${hl + 2},${KNEE_Y} ${CENTER - 15},${ANKLE_Y}`,
    `M${hr},${HIP_Y} Q${hr - 2},${KNEE_Y} ${CENTER + 15},${ANKLE_Y}`,
    `M${CENTER},${HIP_Y + 4} L${CENTER},${HIP_Y + 26}`,
  ];
}

// ── Garment parts ────────────────────────────────────────────────────────────

interface Shape {
  block: Block;
  ease: { body: number; waist: number };
}

/** Bodice or jacket body, from the shoulders down to `hem`. */
function topPiece(
  { block, ease }: Shape,
  hem: number,
  options: { waistNip?: number; boxy?: boolean } = {},
): SketchPiece {
  const shoulder = block.shoulder + 2;
  const chest = block.chest + ease.body;
  const waist = options.boxy
    ? chest
    : block.waist + ease.waist - (options.waistNip ?? 0);
  const hemHalf = options.boxy ? chest + 1 : Math.max(waist + 6, block.hip - 6);

  const [sl, sr] = mirror(shoulder);
  const [cl, cr] = mirror(chest);
  const [wl, wr] = mirror(waist);
  const [hl, hr] = mirror(hemHalf);

  return {
    filled: true,
    d:
      `M${sl},${SHOULDER_Y} Q${cl},${CHEST_Y} ${wl},${WAIST_Y} ` +
      `Q${hl},${(WAIST_Y + hem) / 2} ${hl},${hem} L${hr},${hem} ` +
      `Q${hr},${(WAIST_Y + hem) / 2} ${wr},${WAIST_Y} Q${cr},${CHEST_Y} ${sr},${SHOULDER_Y} ` +
      `Q${CENTER},${SHOULDER_Y - 8} ${sl},${SHOULDER_Y} Z`,
  };
}

function skirtPiece(
  { block, ease }: Shape,
  silhouette: string | undefined,
  hem: number,
  from: number = WAIST_Y,
): SketchPiece {
  const top = block.waist + ease.waist;
  const [tl, tr] = mirror(top);

  // hem width and the shape of the run down to it
  let hemHalf = 52;
  let control = block.hip + 6;
  switch (silhouette) {
    case "Sheath":
      hemHalf = block.hip - 2;
      control = block.hip;
      break;
    case "Mermaid":
      hemHalf = 54;
      control = block.hip - 4;
      break;
    case "Ball Gown":
      hemHalf = 92;
      control = block.hip + 26;
      break;
    case "Empire":
      hemHalf = 62;
      control = block.hip + 14;
      break;
    default: // A-Line and every non-dress skirt
      hemHalf = 56;
      control = block.hip + 8;
  }

  const [hl, hr] = mirror(hemHalf);
  const kneeHalf = silhouette === "Mermaid" ? block.hip - 6 : control;
  const [kl, kr] = mirror(kneeHalf);
  const knee = silhouette === "Mermaid" ? Math.min(KNEE_Y, hem - 40) : (from + hem) / 2;

  return {
    filled: true,
    d:
      `M${tl},${from} L${kl},${knee} Q${hl + 4},${hem - 12} ${hl},${hem} ` +
      `Q${CENTER},${hem + 10} ${hr},${hem} Q${hr - 4},${hem - 12} ${kr},${knee} ` +
      `L${tr},${from} Z`,
  };
}

function trouserPieces(
  { block, ease }: Shape,
  style: string | undefined,
): SketchPiece[] {
  const waist = block.waist + ease.waist;
  const hip = block.hip + Math.round(ease.body / 2);
  const ankle =
    style === "Tapered" ? 11 : style === "Flared" ? 26 : style === "Drawstring" ? 17 : 15;
  const [wl, wr] = mirror(waist);
  const [hl, hr] = mirror(hip);

  const leg = (side: -1 | 1): string => {
    const outerHip = CENTER + side * hip;
    const outerAnkle = CENTER + side * (15 + ankle);
    const innerAnkle = CENTER + side * Math.max(15 - ankle + 8, 3);
    return (
      `M${outerHip},${HIP_Y - 10} Q${outerHip + side * 2},${KNEE_Y} ${outerAnkle},${ANKLE_Y} ` +
      `L${innerAnkle},${ANKLE_Y} Q${CENTER + side * 6},${KNEE_Y} ${CENTER + side * 3},${HIP_Y + 28} Z`
    );
  };

  const pieces: SketchPiece[] = [
    { filled: true, d: `M${wl},${WAIST_Y + 4} L${hl},${HIP_Y} L${hr},${HIP_Y} L${wr},${WAIST_Y + 4} Z` },
    { filled: true, d: leg(-1) },
    { filled: true, d: leg(1) },
  ];

  if (style === "Drawstring") {
    pieces.push({
      detail: true,
      d: `M${wl + 4},${WAIST_Y + 9} L${wr - 4},${WAIST_Y + 9} M${CENTER - 6},${WAIST_Y + 9} L${CENTER - 9},${WAIST_Y + 22} M${CENTER + 6},${WAIST_Y + 9} L${CENTER + 9},${WAIST_Y + 22}`,
    });
  }
  return pieces;
}

function sleevePieces(
  { block, ease }: Shape,
  type: string | undefined,
): SketchPiece[] {
  if (!type || type === "Sleeveless") return [];

  const shoulder = block.shoulder + 2;
  // how far down the arm the sleeve runs
  const stop =
    type === "Short"
      ? 0.34
      : type === "3/4"
        ? 0.68
        : type === "Puff"
          ? 0.3
          : 1;
  const armTop = SHOULDER_Y + 2;
  const armEnd = HIP_Y + 20;
  const endY = armTop + (armEnd - armTop) * stop;
  const width = (type === "Puff" ? 15 : type === "Bell" ? 8 : 7) + ease.body / 2;
  const endWidth = type === "Bell" ? 18 : type === "Puff" ? 9 : 6;

  return ([-1, 1] as const).map((side) => {
    const sx = CENTER + side * shoulder;
    const bulge = CENTER + side * (shoulder + width);
    const ex = CENTER + side * (shoulder + (type === "Puff" ? 4 : 6));
    return {
      filled: true,
      d:
        `M${sx},${armTop} Q${bulge},${(armTop + endY) / 2} ${ex + side * endWidth},${endY} ` +
        `L${ex - side * 2},${endY} Q${sx + side * 3},${(armTop + endY) / 2} ${sx - side * 4},${armTop + 6} Z`,
    };
  });
}

function necklinePiece(name: string | undefined): SketchPiece | null {
  const y = SHOULDER_Y;
  switch (name) {
    case "V-Neck":
      return { detail: true, d: `M${CENTER - 13},${y} L${CENTER},${y + 34} L${CENTER + 13},${y}` };
    case "Sweetheart":
      return {
        detail: true,
        d: `M${CENTER - 16},${y + 2} Q${CENTER - 8},${y + 20} ${CENTER},${y + 12} Q${CENTER + 8},${y + 20} ${CENTER + 16},${y + 2}`,
      };
    case "High Neck":
    case "Mandarin":
      return { detail: true, d: `M${CENTER - 9},${y - 2} L${CENTER - 9},${y - 14} L${CENTER + 9},${y - 14} L${CENTER + 9},${y - 2}` };
    case "Off-Shoulder":
      return { detail: true, d: `M${CENTER - 30},${y + 10} Q${CENTER},${y + 24} ${CENTER + 30},${y + 10}` };
    case "Halter":
      return { detail: true, d: `M${CENTER - 12},${y + 16} L${CENTER - 4},${y - 16} M${CENTER + 12},${y + 16} L${CENTER + 4},${y - 16}` };
    case "Round":
      return { detail: true, d: `M${CENTER - 14},${y + 1} Q${CENTER},${y + 20} ${CENTER + 14},${y + 1}` };
    case "Traditional":
      return {
        detail: true,
        d: `M${CENTER - 15},${y + 1} Q${CENTER},${y + 21} ${CENTER + 15},${y + 1} M${CENTER - 11},${y + 7} Q${CENTER},${y + 25} ${CENTER + 11},${y + 7}`,
      };
    default:
      return null;
  }
}

function lapelPieces(style: string | undefined, closure: string | undefined): SketchPiece[] {
  const y = SHOULDER_Y;
  const pieces: SketchPiece[] = [];
  const left = `M${CENTER - 13},${y + 1} L${CENTER - 6},${y + 42}`;
  const right = `M${CENTER + 13},${y + 1} L${CENTER + 6},${y + 42}`;

  switch (style) {
    case "Peak":
      pieces.push({
        detail: true,
        d: `${left} M${CENTER - 13},${y + 14} L${CENTER - 24},${y + 8} L${CENTER - 12},${y + 22} ${right} M${CENTER + 13},${y + 14} L${CENTER + 24},${y + 8} L${CENTER + 12},${y + 22}`,
      });
      break;
    case "Shawl":
      pieces.push({
        detail: true,
        d: `M${CENTER - 14},${y + 2} Q${CENTER - 20},${y + 26} ${CENTER - 6},${y + 44} M${CENTER + 14},${y + 2} Q${CENTER + 20},${y + 26} ${CENTER + 6},${y + 44}`,
      });
      break;
    case "Collarless":
      pieces.push({ detail: true, d: `M${CENTER - 12},${y + 2} Q${CENTER},${y + 18} ${CENTER + 12},${y + 2}` });
      break;
    case "Notch":
      pieces.push({
        detail: true,
        d: `${left} M${CENTER - 13},${y + 15} L${CENTER - 22},${y + 17} ${right} M${CENTER + 13},${y + 15} L${CENTER + 22},${y + 17}`,
      });
      break;
    default:
      break;
  }

  if (closure === "Double-Breasted") {
    pieces.push({
      detail: true,
      d: `M${CENTER - 10},${y + 56} L${CENTER - 10},${y + 58} M${CENTER + 10},${y + 56} L${CENTER + 10},${y + 58} M${CENTER - 10},${y + 74} L${CENTER - 10},${y + 76} M${CENTER + 10},${y + 74} L${CENTER + 10},${y + 76} M${CENTER - 10},${y + 56} L${CENTER + 10},${y + 74}`,
    });
  } else if (closure && closure !== "Open Front") {
    pieces.push({
      detail: true,
      d: `M${CENTER},${y + 58} L${CENTER},${y + 60} M${CENTER},${y + 76} L${CENTER},${y + 78}`,
    });
  }
  return pieces;
}

function capPiece(style: string | undefined, block: Block): SketchPiece | null {
  if (!style || style === "None") return null;
  const { headR: r, headY: cy } = block;
  switch (style) {
    case "Fila":
      return { d: `M${CENTER - r - 2},${cy - r + 6} Q${CENTER},${cy - r - 14} ${CENTER + r + 2},${cy - r + 6} Q${CENTER},${cy - r + 12} ${CENTER - r - 2},${cy - r + 6} Z`, filled: true };
    case "Okpu Agu":
      return {
        filled: true,
        d: `M${CENTER - r},${cy - r + 4} L${CENTER - r},${cy - r - 10} L${CENTER + r},${cy - r - 10} L${CENTER + r},${cy - r + 4} Z M${CENTER + r - 4},${cy - r - 10} L${CENTER + r + 8},${cy - r - 24}`,
      };
    case "Songhai":
      return { filled: true, d: `M${CENTER - r - 1},${cy - r + 2} L${CENTER - r + 3},${cy - r - 12} L${CENTER + r - 3},${cy - r - 12} L${CENTER + r + 1},${cy - r + 2} Z` };
    case "Kofia":
      return { filled: true, d: `M${CENTER - r + 1},${cy - r + 4} Q${CENTER},${cy - r - 16} ${CENTER + r - 1},${cy - r + 4} Z` };
    default:
      return { detail: true, dashed: true, d: `M${CENTER - r},${cy - r + 2} Q${CENTER},${cy - r - 16} ${CENTER + r},${cy - r + 2}` };
  }
}

function embroideryPiece(level: string | undefined): SketchPiece | null {
  if (!level || level === "None") return null;
  const y = SHOULDER_Y;
  const rows =
    level === "Minimal" ? 1 : level === "Traditional" ? 2 : 4;
  const segments: string[] = [];
  for (let i = 0; i < rows; i += 1) {
    const oy = y + 30 + i * 13;
    segments.push(`M${CENTER - 16},${oy} L${CENTER + 16},${oy}`);
  }
  return { detail: true, dashed: true, d: segments.join(" ") };
}

// ── Composition ──────────────────────────────────────────────────────────────

const waistcoat = (): SketchPiece => ({
  detail: true,
  d: `M${CENTER - 15},${SHOULDER_Y + 12} L${CENTER - 17},${WAIST_Y + 16} L${CENTER},${WAIST_Y + 26} L${CENTER + 17},${WAIST_Y + 16} L${CENTER + 15},${SHOULDER_Y + 12} Q${CENTER},${SHOULDER_Y + 30} ${CENTER - 15},${SHOULDER_Y + 12} Z`,
});

const JACKET_HEM = 300;

function suitSketch(shape: Shape, values: Customizations, wearer: Wearer): SketchPiece[] {
  const composition = values.composition;
  const silhouette = values.silhouette;
  const pieces: SketchPiece[] = [];

  const hem =
    silhouette === "Cropped"
      ? 245
      : composition === "Tuxedo"
        ? 310
        : JACKET_HEM;
  const nip = silhouette === "Fitted Waist" || values.fit === "Tailored" ? 4 : 0;

  // bottom half first, so the jacket overlaps it
  if (composition === "Skirt Suit") {
    pieces.push(skirtPiece(shape, "A-Line", 350));
  } else if (composition !== "Blazer Only" || wearer === "men") {
    pieces.push(...trouserPieces(shape, undefined));
  } else {
    pieces.push(...trouserPieces(shape, undefined).map((p) => ({ ...p, dashed: true, filled: false })));
  }

  if (composition === "Tuxedo") {
    pieces.push({ detail: true, d: `M${CENTER + 22},${HIP_Y + 4} L${CENTER + 26},${ANKLE_Y}` });
  }
  if (composition === "Three-Piece") pieces.push(waistcoat());

  pieces.push(topPiece(shape, hem, { waistNip: nip, boxy: silhouette === "Boxy" }));

  if (silhouette === "Peplum") {
    pieces.push({
      d: `M${CENTER - 24},${hem - 26} Q${CENTER - 44},${hem + 6} ${CENTER - 30},${hem + 14} L${CENTER + 30},${hem + 14} Q${CENTER + 44},${hem + 6} ${CENTER + 24},${hem - 26}`,
      filled: true,
    });
  }

  pieces.push(...lapelPieces(values.lapelStyle, values.buttons));
  pieces.push(...sleevePieces(shape, "Long"));
  return pieces;
}

function dressSketch(shape: Shape, values: Customizations): SketchPiece[] {
  const hem = DRESS_HEM[values.length] ?? 410;
  const silhouette = values.silhouette;
  const empire = silhouette === "Empire";
  const bodiceHem = empire ? 165 : WAIST_Y;

  const pieces: SketchPiece[] = [
    skirtPiece(shape, silhouette, hem, bodiceHem),
    topPiece(shape, bodiceHem + 4, {
      waistNip: silhouette === "Mermaid" || values.fit === "Tailored" ? 4 : 0,
    }),
    ...sleevePieces(shape, values.sleeveType),
  ];

  const neck = necklinePiece(values.neckline);
  if (neck) pieces.push(neck);
  return pieces;
}

function nativeSketch(shape: Shape, values: Customizations): SketchPiece[] {
  const pieces: SketchPiece[] = [
    ...trouserPieces(shape, values.trouserStyle),
    topPiece(shape, 300, { boxy: values.fit === "Relaxed" }),
    ...sleevePieces(shape, values.sleeveType),
  ];

  const neck = necklinePiece(values.neckStyle);
  if (neck) pieces.push(neck);
  const embroidery = embroideryPiece(values.embroidery);
  if (embroidery) pieces.push(embroidery);
  const cap = capPiece(values.capStyle, shape.block);
  if (cap) pieces.push(cap);
  return pieces;
}

function corporateSketch(shape: Shape, values: Customizations): SketchPiece[] {
  const bottom = values.skirtOrTrousers;
  const pieces: SketchPiece[] = [];

  if (bottom === "Skirt") {
    pieces.push(skirtPiece(shape, "Sheath", 350));
  } else if (bottom === "Both") {
    pieces.push({ ...skirtPiece(shape, "Sheath", 350), filled: false, dashed: true });
    pieces.push(...trouserPieces(shape, undefined));
  } else {
    pieces.push(...trouserPieces(shape, undefined));
  }

  pieces.push(topPiece(shape, 290, { waistNip: values.fit === "Tailored" ? 4 : 0 }));
  pieces.push(...lapelPieces("Notch", values.jacketStyle));
  pieces.push(...sleevePieces(shape, "Long"));
  return pieces;
}

function weddingSketch(shape: Shape, values: Customizations, wearer: Wearer): SketchPiece[] {
  const gownRoles = ["Bride", "Bridesmaid", "Mother"];
  const wearsGown =
    gownRoles.includes(values.role) || (values.role === "Guest" && wearer === "women");

  if (!wearsGown) {
    return suitSketch(shape, { ...values, composition: values.formality === "Formal" ? "Tuxedo" : "Two-Piece" }, wearer);
  }

  const silhouette = values.formality === "Formal" ? "Ball Gown" : "A-Line";
  const hem = values.formality === "Casual" ? 410 : ANKLE_Y;
  return [
    skirtPiece(shape, silhouette, hem),
    topPiece(shape, WAIST_Y + 4, { waistNip: 4 }),
    ...sleevePieces(shape, values.role === "Bride" ? "Sleeveless" : "Short"),
  ];
}

function genericSketch(shape: Shape, values: Customizations): SketchPiece[] {
  return [
    ...trouserPieces(shape, undefined),
    topPiece(shape, 280, { boxy: values.fit === "Relaxed" }),
    ...sleevePieces(shape, "Short"),
  ];
}

// ── Entry point ──────────────────────────────────────────────────────────────

export function buildGarmentSketch(
  outfitType: OutfitType,
  wearer: Wearer | undefined,
  values: Customizations,
): GarmentSketch {
  const resolved: Wearer = wearer ?? (outfitType === "dresses" ? "women" : "men");
  const block = BLOCKS[resolved];
  const shape: Shape = {
    block,
    ease: EASE[values.fit] ?? EASE.Regular,
  };

  let pieces: SketchPiece[];
  switch (outfitType) {
    case "suits":
      pieces = suitSketch(shape, values, resolved);
      break;
    case "dresses":
      pieces = dressSketch(shape, values);
      break;
    case "native-wear":
      pieces = nativeSketch(shape, values);
      break;
    case "corporate":
      pieces = corporateSketch(shape, values);
      break;
    case "wedding":
      pieces = weddingSketch(shape, values, resolved);
      break;
    default:
      pieces = genericSketch(shape, values);
  }

  return {
    head: { cx: CENTER, cy: block.headY, r: block.headR },
    body: bodyPaths(block),
    pieces,
    guides: [
      { y: SHOULDER_Y, half: block.shoulder + 26 },
      { y: WAIST_Y, half: block.waist + 30 },
      { y: HIP_Y, half: block.hip + 26 },
    ],
  };
}
