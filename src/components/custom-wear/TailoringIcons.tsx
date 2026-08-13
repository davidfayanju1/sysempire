// Minimal line-art "spec sketch" icons for the customization step.
//
// Two families live here:
//  - Close-up glyphs (default 48x48 viewBox): a zoomed-in look at one
//    construction detail — a lapel notch, a hem vent, a pocket — used for
//    suit-specific fields where the detail itself is the whole story.
//  - On-body glyphs (40x88 viewBox, BODY_VIEWBOX): the option drawn on a
//    faint croquis figure, so the customer sees roughly where on an actual
//    body the choice sits and what silhouette it produces — used for fields
//    like neckline, sleeve length, or dress silhouette where "where on the
//    body" and "how much of it" are the point.
//
// All icons inherit color via `currentColor`, so they automatically match
// the selected/unselected button state they sit in.

interface TailoringIconProps {
  variant: string;
  className?: string;
}

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const DEFAULT_VIEWBOX = "0 0 48 48";
const BODY_VIEWBOX = "0 0 40 88";

// Shared faint croquis (front view, arms at sides) that every on-body icon
// draws its highlighted detail on top of. Kept low-opacity/thin so the
// full-strength overlay — the actual thing being chosen — reads first.
const bodyBase = (
  <g opacity={0.4} strokeWidth={1.1}>
    <circle cx="20" cy="9" r="4" />
    <path d="M20 13 L20 17" />
    <path d="M9 19 L31 19" />
    <path d="M9 19 L12 38 L10 52 M31 19 L28 38 L30 52" />
    <path d="M9 19 L5 45 M31 19 L35 45" />
    <path d="M10 52 L13 84 M30 52 L27 84" />
  </g>
);

interface IconEntry {
  viewBox?: string;
  content: React.ReactNode;
}

const icons: Record<string, IconEntry> = {
  // ── Fit / silhouette (shared) ─────────────────────────────────────────
  "fit-regular": { content: <path d="M17 8 L31 8 L30 40 L18 40 Z" /> },
  "fit-slim": {
    content: (
      <>
        <path d="M19 8 L29 8 L27 40 L21 40 Z" />
        <path d="M22 17 Q24 24 22 31 M26 17 Q24 24 26 31" />
      </>
    ),
  },
  "fit-relaxed": { content: <path d="M18 8 L30 8 L36 40 L12 40 Z" /> },
  "fit-tailored": { content: <path d="M16 8 L32 8 L27 22 L32 40 L16 40 L21 22 Z" /> },

  // ── Who's this for (garment cut, not a body icon) ────────────────────
  "suitfor-men": {
    content: (
      <>
        <path d="M14 10 L24 16 L34 10 L34 40 L14 40 Z" />
        <path d="M22 14 L24 16 L26 14 L25 25 L23 25 Z" />
      </>
    ),
  },
  "suitfor-women": { content: <path d="M14 10 Q24 19 34 10 L30 25 L33 40 L15 40 L18 25 Z" /> },

  // ── Suit composition (menswear) ───────────────────────────────────────
  "composition-blazer": {
    content: (
      <>
        <path d="M16 10 L24 16 L32 10 L34 14 L34 34 L14 34 L14 14 Z" />
        <path d="M14 14 L8 20 L10 30 L14 26 M34 14 L40 20 L38 30 L34 26" />
      </>
    ),
  },
  "composition-two-piece": {
    content: (
      <>
        <path d="M16 8 L24 14 L32 8 L34 12 L34 28 L14 28 L14 12 Z" />
        <path d="M16 28 L21 28 L21 42 L16 42 Z M27 28 L32 28 L32 42 L27 42 Z" />
      </>
    ),
  },
  "composition-three-piece": {
    content: (
      <>
        <path d="M16 8 L24 14 L32 8 L34 12 L34 28 L14 28 L14 12 Z" />
        <path d="M22 14 L24 16 L26 14 L24 27 Z" />
        <path d="M16 28 L21 28 L21 42 L16 42 Z M27 28 L32 28 L32 42 L27 42 Z" />
      </>
    ),
  },
  "composition-tuxedo": {
    content: (
      <>
        <path d="M16 8 L24 14 L32 8 L34 12 L34 28 L14 28 L14 12 Z" />
        <path d="M21 12 L24 15 L27 12 L27 14 L24 17 L21 14 Z" />
        <path d="M16 28 L21 28 L21 42 L16 42 Z M27 28 L32 28 L32 42 L27 42 Z" />
        <path d="M18.5 28 L18.5 42 M29.5 28 L29.5 42" strokeWidth={0.9} />
      </>
    ),
  },

  // ── Suit composition (womenswear) ─────────────────────────────────────
  "composition-pantsuit": {
    content: (
      <>
        <path d="M16 8 Q24 15 32 8 L33 12 L33 28 L15 28 L15 12 Z" />
        <path d="M16 28 L21 28 L21 42 L16 42 Z M27 28 L32 28 L32 42 L27 42 Z" />
      </>
    ),
  },
  "composition-skirt-suit": {
    content: (
      <>
        <path d="M16 8 Q24 15 32 8 L33 12 L33 26 L15 26 L15 12 Z" />
        <path d="M17 26 L31 26 L35 42 L13 42 Z" />
      </>
    ),
  },
  "composition-three-piece-women": {
    content: (
      <>
        <path d="M16 8 Q24 15 32 8 L33 12 L33 26 L15 26 L15 12 Z" />
        <path d="M22 12 L24 14 L26 12 L24 25 Z" />
        <path d="M17 26 L31 26 L35 42 L13 42 Z" />
      </>
    ),
  },

  // ── Lapel style ────────────────────────────────────────────────────────
  "lapel-notch": {
    content: (
      <>
        <path d="M8 10 L17 17 L14 20 L24 34" />
        <path d="M40 10 L31 17 L34 20 L24 34" />
      </>
    ),
  },
  "lapel-peak": {
    content: (
      <>
        <path d="M8 10 L18 15 L13 21 L24 34" />
        <path d="M40 10 L30 15 L35 21 L24 34" />
      </>
    ),
  },
  "lapel-shawl": {
    content: (
      <>
        <path d="M8 10 Q17 20 24 34" />
        <path d="M40 10 Q31 20 24 34" />
      </>
    ),
  },
  "lapel-collarless": { content: <path d="M12 14 Q24 24 36 14" /> },

  // ── Button / closure style (menswear) ──────────────────────────────────
  "buttons-two": {
    content: (
      <>
        <path d="M24 10 L24 38" />
        <circle cx="24" cy="20" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="24" cy="28" r="1.6" fill="currentColor" stroke="none" />
      </>
    ),
  },
  "buttons-three": {
    content: (
      <>
        <path d="M24 8 L24 40" />
        <circle cx="24" cy="16" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="24" cy="24" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="24" cy="32" r="1.6" fill="currentColor" stroke="none" />
      </>
    ),
  },
  "buttons-double-breasted": {
    content: (
      <>
        <path d="M18 10 L18 38 M30 10 L30 38" />
        <circle cx="18" cy="17" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="18" cy="25" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="18" cy="33" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="30" cy="17" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="30" cy="25" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="30" cy="33" r="1.6" fill="currentColor" stroke="none" />
      </>
    ),
  },

  // ── Button / closure style (womenswear) ────────────────────────────────
  "buttons-single-breasted": {
    content: (
      <>
        <path d="M24 10 L24 38" />
        <circle cx="24" cy="19" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="24" cy="29" r="1.6" fill="currentColor" stroke="none" />
      </>
    ),
  },
  "buttons-open-front": { content: <path d="M18 10 L14 38 M30 10 L34 38" /> },

  // ── Vent style ───────────────────────────────────────────────────────
  "vent-single": {
    content: (
      <>
        <path d="M12 28 L36 28 M14 28 L12 40 M34 28 L36 40" />
        <path d="M24 28 L24 40" />
      </>
    ),
  },
  "vent-double": {
    content: (
      <>
        <path d="M12 28 L36 28 M14 28 L12 40 M34 28 L36 40" />
        <path d="M19 28 L19 40 M29 28 L29 40" />
      </>
    ),
  },
  "vent-none": { content: <path d="M12 28 L36 28 M14 28 L12 40 L36 40 L34 28" /> },

  // ── Pocket style ─────────────────────────────────────────────────────
  "pocket-flap": {
    content: (
      <>
        <path d="M13 18 L35 18 L35 22 L13 22 Z" />
        <path d="M14 22 L34 22" />
      </>
    ),
  },
  "pocket-jetted": { content: <path d="M13 22 L35 22 M13 25 L35 25" /> },
  "pocket-patch": { content: <path d="M14 14 L34 14 L34 34 L14 34 Z" strokeDasharray="2.5 2.5" /> },
  "pocket-ticket": {
    content: (
      <>
        <path d="M11 22 L31 22 L31 26 L11 26 Z" />
        <path d="M12 26 L30 26" />
        <path d="M32 15 L40 15 L40 19 L32 19 Z" />
      </>
    ),
  },
  "pocket-none": { content: <path d="M14 14 L34 14 L34 34 L14 34 Z" strokeWidth={1} opacity={0.35} /> },

  // ── Jacket silhouette (womenswear suits) ────────────────────────────────
  "silhouette-fitted": { content: <path d="M16 8 L32 8 L28 24 L31 40 L17 40 L20 24 Z" /> },
  "silhouette-boxy": { content: <path d="M16 8 L32 8 L32 40 L16 40 Z" /> },
  "silhouette-peplum": {
    content: (
      <>
        <path d="M17 8 L31 8 L28 26 L20 26 Z" />
        <path d="M18 26 L30 26 L34 33 L14 33 Z" />
      </>
    ),
  },
  "silhouette-cropped": {
    content: (
      <>
        <path d="M17 8 L31 8 L27 24 L21 24 Z" />
        <path d="M15 34 L33 34" strokeDasharray="2.5 2.5" />
      </>
    ),
  },

  // ═══════════════════════════════════════════════════════════════════════
  // On-body glyphs — the option drawn on the shared croquis (BODY_VIEWBOX).
  // ═══════════════════════════════════════════════════════════════════════

  // ── Neck style (native wear) ────────────────────────────────────────────
  "neck-round": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M14 15 Q20 22 26 15" />
      </>
    ),
  },
  "neck-vneck": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M14 15 L20 26 L26 15" />
      </>
    ),
  },
  "neck-mandarin": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M15 13 L15 18 Q20 20 25 18 L25 13" />
      </>
    ),
  },
  "neck-traditional": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M14 15 Q20 22 26 15" />
        <path
          d="M12 17 L13 19 M28 17 L27 19 M17 24 L18 26 M23 24 L22 26"
          strokeWidth={0.9}
        />
      </>
    ),
  },

  // ── Sleeve type (native wear + dresses) ─────────────────────────────────
  "sleeve-short": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M9 19 L7 30 M31 19 L33 30" strokeWidth={2.2} />
      </>
    ),
  },
  "sleeve-long": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M9 19 L5 45 M31 19 L35 45" strokeWidth={2.2} />
      </>
    ),
  },
  "sleeve-3-4": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M9 19 L6 38 M31 19 L34 38" strokeWidth={2.2} />
      </>
    ),
  },
  sleeveless: {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M8 18 Q9 22 11 24 M32 18 Q31 22 29 24" strokeWidth={2} />
      </>
    ),
  },
  "sleeve-puff": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path
          d="M8 19 Q4 24 8 29 Q11 25 9 19 M32 19 Q36 24 32 29 Q29 25 31 19"
          strokeWidth={1.8}
        />
      </>
    ),
  },
  "sleeve-bell": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M9 19 L7 32 L2 44 M31 19 L33 32 L38 44" strokeWidth={2} />
      </>
    ),
  },

  // ── Embroidery (native wear) ────────────────────────────────────────────
  "embroidery-none": { viewBox: BODY_VIEWBOX, content: <>{bodyBase}</> },
  "embroidery-minimal": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M17 16 L23 16 M6 44 L9 46 M31 44 L34 46" strokeWidth={1.3} />
      </>
    ),
  },
  "embroidery-traditional": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M14 15 Q20 21 26 15" strokeDasharray="1.5 1.5" />
        <path d="M5 43 L9 47 M31 43 L35 47" strokeDasharray="1.5 1.5" />
      </>
    ),
  },
  "embroidery-premium": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M14 15 Q20 21 26 15" strokeDasharray="1.2 1.2" />
        <path
          d="M13 22 L27 22 M14 26 L26 26 M15 30 L25 30"
          strokeWidth={1}
          strokeDasharray="1.2 1.2"
        />
        <path d="M5 43 L9 47 M31 43 L35 47" strokeDasharray="1.2 1.2" />
      </>
    ),
  },

  // ── Trouser style (native wear) ─────────────────────────────────────────
  "trouser-straight": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M11 53 L13 83 M29 53 L27 83" strokeWidth={2} />
      </>
    ),
  },
  "trouser-tapered": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M11 53 L15 83 M29 53 L25 83" strokeWidth={2} />
      </>
    ),
  },
  "trouser-flared": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M13 53 L9 83 M27 53 L31 83" strokeWidth={2} />
      </>
    ),
  },
  "trouser-drawstring": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M11 53 L13 83 M29 53 L27 83" strokeWidth={2} />
        <path d="M16 51 L18 54 M24 51 L22 54" strokeWidth={1.2} />
      </>
    ),
  },

  // ── Cap / headwear (native wear) ────────────────────────────────────────
  "cap-none": { viewBox: BODY_VIEWBOX, content: <>{bodyBase}</> },
  "cap-fila": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M14 6 Q20 1 26 6 Q26 9 20 9 Q14 9 14 6 Z" />
      </>
    ),
  },
  "cap-okpu-agu": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M14 6 Q20 1 26 6 Q26 9 20 9 Q14 9 14 6 Z" />
        <path d="M22 2 L24 0" strokeWidth={1.3} />
      </>
    ),
  },
  "cap-songhai": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M14 7 L26 7 L24 3 L16 3 Z" />
      </>
    ),
  },
  "cap-kofia": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M15 6 Q20 3 25 6 L25 8 L15 8 Z" />
      </>
    ),
  },
  "cap-other": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M26 2.5 Q29.5 1.5 29.5 3.5 Q29.5 5.5 27.3 6 L27.3 7.2" strokeWidth={1.3} />
        <circle cx="27.3" cy="9" r="0.7" fill="currentColor" stroke="none" />
      </>
    ),
  },

  // ── Neckline (dresses) ──────────────────────────────────────────────────
  "neckline-sweetheart": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M14 16 Q17 20 20 18 Q23 20 26 16" />
      </>
    ),
  },
  "neckline-highneck": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M16 13 Q20 15 24 13" />
      </>
    ),
  },
  "neckline-offshoulder": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M8 23 L32 23" strokeWidth={2} />
      </>
    ),
  },
  "neckline-halter": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M18 12 L18 20 M22 12 L22 20 M17 12 Q20 9 23 12" />
      </>
    ),
  },

  // ── Dress length ─────────────────────────────────────────────────────────
  "length-mini": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M11 52 L9 60 L31 60 L29 52" />
        <path d="M9 60 L31 60" strokeWidth={2.2} />
      </>
    ),
  },
  "length-knee": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M11 52 L8 67 L32 67 L29 52" />
        <path d="M8 67 L32 67" strokeWidth={2.2} />
      </>
    ),
  },
  "length-midi": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M11 52 L7 76 L33 76 L29 52" />
        <path d="M7 76 L33 76" strokeWidth={2.2} />
      </>
    ),
  },
  "length-maxi": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M11 52 L6 84 L34 84 L29 52" />
        <path d="M6 84 L34 84" strokeWidth={2.2} />
      </>
    ),
  },

  // ── Dress silhouette ────────────────────────────────────────────────────
  "dress-silhouette-aline": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M11 19 L12 38 L6 82 M29 19 L28 38 L34 82" />
        <path d="M6 82 L34 82" strokeWidth={2} />
      </>
    ),
  },
  "dress-silhouette-sheath": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M11 19 L11 82 M29 19 L29 82" />
      </>
    ),
  },
  "dress-silhouette-mermaid": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M11 19 L12 65 L6 82 M29 19 L28 65 L34 82" />
      </>
    ),
  },
  "dress-silhouette-ballgown": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M12 19 L12 38 M28 19 L28 38" />
        <path d="M12 38 L2 82 M28 38 L38 82" />
        <path d="M2 82 L38 82" strokeWidth={2} />
      </>
    ),
  },
  "dress-silhouette-empire": {
    viewBox: BODY_VIEWBOX,
    content: (
      <>
        {bodyBase}
        <path d="M11 19 L13 28 M29 19 L27 28" />
        <path d="M13 28 L27 28" strokeWidth={1.8} />
        <path d="M13 28 L8 82 M27 28 L32 82" />
      </>
    ),
  },
};

const TailoringIcon = ({ variant, className }: TailoringIconProps) => {
  const icon = icons[variant];
  if (!icon) return null;

  return (
    <svg viewBox={icon.viewBox ?? DEFAULT_VIEWBOX} className={className} {...strokeProps}>
      {icon.content}
    </svg>
  );
};

export default TailoringIcon;
