// The live design sketch in the Step 4 summary: a croquis figure wearing the
// answers so far, redrawn on every choice.
//
// The geometry comes from lib/garmentSketch.ts. The hand-drawn quality is an
// SVG displacement filter: fractal noise nudging each point off the vector
// line, so straight paths read as pencil rather than CAD.
import { useId } from "react";
import type { Customizations, OutfitType, Wearer } from "../../lib/customizationFields";
import { buildGarmentSketch } from "../../lib/garmentSketch";

interface GarmentSketchPreviewProps {
  outfitType: OutfitType;
  wearer: Wearer | undefined;
  values: Customizations;
  className?: string;
  /** Guides and paper texture are dropped in the small mobile strip. */
  compact?: boolean;
}

const INK = "#1C1A18";
const BODY = "#C4BCB1";
const GUIDE = "#DCD4C8";
const WASH = "rgba(168, 69, 30, 0.07)";

const GarmentSketchPreview = ({
  outfitType,
  wearer,
  values,
  className = "",
  compact = false,
}: GarmentSketchPreviewProps) => {
  const filterId = `sketch-wobble-${useId()}`;
  const { head, body, pieces, guides } = buildGarmentSketch(
    outfitType,
    wearer,
    values,
  );

  return (
    <svg
      viewBox="0 0 300 500"
      className={className}
      role="img"
      aria-label="Sketch of your garment so far"
    >
      <defs>
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves={3}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <g
        filter={`url(#${filterId})`}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {!compact &&
          guides.map((guide) => (
            <line
              key={guide.y}
              x1={150 - guide.half}
              y1={guide.y}
              x2={150 + guide.half}
              y2={guide.y}
              stroke={GUIDE}
              strokeWidth={1}
              strokeDasharray="4 5"
            />
          ))}

        {/* Croquis figure */}
        <g stroke={BODY} strokeWidth={1.4}>
          <circle cx={head.cx} cy={head.cy} r={head.r} />
          {body.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        {/* The garment itself */}
        <g stroke={INK}>
          {pieces.map((piece, index) => (
            <path
              key={`${index}-${piece.d.slice(0, 24)}`}
              d={piece.d}
              fill={piece.filled ? WASH : "none"}
              strokeWidth={piece.detail ? 1.3 : 2}
              strokeDasharray={piece.dashed ? "5 4" : undefined}
            />
          ))}
        </g>
      </g>
    </svg>
  );
};

export default GarmentSketchPreview;
