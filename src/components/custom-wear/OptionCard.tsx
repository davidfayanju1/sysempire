import type { ReactNode } from "react";
import type { Crop } from "../../lib/customizationFields";

interface OptionCardProps {
  label: string;
  crop: Crop;
  image: string | undefined;
  fallbackIcon: ReactNode;
  selected: boolean;
  onSelect: () => void;
}

const OptionCard = ({
  label,
  crop,
  image,
  fallbackIcon,
  selected,
  onSelect,
}: OptionCardProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative flex flex-col bg-white text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
        selected
          ? "border border-ink"
          : "border border-line hover:border-neutral-400"
      }`}
    >
      <div
        className={`flex w-full items-center justify-center overflow-hidden bg-paper ${
          crop === "figure" ? "aspect-3/4" : "aspect-square"
        }`}
      >
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-contain motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03] ${
              crop === "figure" ? "p-3" : ""
            }`}
          />
        ) : (
          <span
            data-testid="option-fallback"
            className={selected ? "text-ink" : "text-neutral-500"}
          >
            {fallbackIcon}
          </span>
        )}
      </div>

      <span className="px-3 py-3 text-[10px] uppercase tracking-[0.16em] text-ink md:px-3.5 md:text-[11px] md:tracking-[0.18em]">
        {label}
      </span>

      {selected && (
        <span
          aria-hidden="true"
          className="absolute right-2 top-2 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-ink"
        >
          <svg viewBox="0 0 24 24" width="12" height="12">
            <path
              d="M5 12l5 5 9-10"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </button>
  );
};

export default OptionCard;
