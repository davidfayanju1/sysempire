// A croquis figure with the measuring lines drawn over it, so the manual form
// shows where on the body each number is taken from.
// The guide data lives in lib/measurementGuides.ts.
import { getSketch } from "../../lib/sketchRegistry";
import {
  FEMALE_GUIDES,
  MALE_GUIDES,
} from "../../lib/measurementGuides";

interface CroquisGuideProps {
  profile: "female" | "male";
  active: string | null;
}

const CroquisGuide = ({ profile, active }: CroquisGuideProps) => {
  const guides = profile === "male" ? MALE_GUIDES : FEMALE_GUIDES;
  const image = getSketch(`croquis/${profile}`);

  return (
    <div className="relative mx-auto aspect-3/4 w-full max-w-[450px] bg-paper">
      {image && (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}
      <svg
        viewBox="0 0 120 160"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {guides.map((guide, index) => {
          const isActive = guide.name === active;
          return (
            <g key={guide.name} opacity={active && !isActive ? 0.35 : 1}>
              <path
                d={guide.path}
                fill="none"
                stroke="#A8451E"
                strokeWidth={isActive ? 2.2 : 1}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={guide.marker.x}
                cy={guide.marker.y}
                r={isActive ? 3.6 : 3.2}
                fill="#A8451E"
              />
              <text
                x={guide.marker.x}
                y={guide.marker.y + 1.3}
                fontSize="3.6"
                fill="#FFFFFF"
                textAnchor="middle"
              >
                {index + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default CroquisGuide;
