// Colour fields are answered with swatches rather than sketches, a drawing of
// "Navy" would only ever be a rectangle of navy.
import { SWATCHES } from "../../lib/swatches";

const NEUTRAL: readonly string[] = ["#E4DDD2"];

interface SwatchGroupProps {
  labelledBy: string;
  options: readonly string[];
  value: string | undefined;
  onSelect: (option: string) => void;
}

const SwatchGroup = ({
  labelledBy,
  options,
  value,
  onSelect,
}: SwatchGroupProps) => {
  return (
    <div role="group" aria-labelledby={labelledBy} className="flex flex-wrap gap-5">
      {options.map((option) => {
        const colours = SWATCHES[option] ?? NEUTRAL;
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(option)}
            className="flex min-w-[72px] cursor-pointer flex-col items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            <span
              className={`flex h-12 w-12 overflow-hidden rounded-full border ${
                selected
                  ? "border-ink ring-2 ring-ink ring-offset-2 ring-offset-canvas"
                  : "border-line"
              }`}
            >
              {colours.map((colour) => (
                <span
                  key={colour}
                  className="h-full flex-1"
                  style={{ backgroundColor: colour }}
                />
              ))}
            </span>
            <span className="text-[11px] uppercase tracking-[0.14em] text-ink">
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default SwatchGroup;
