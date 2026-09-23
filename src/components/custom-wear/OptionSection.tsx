import type {
  FieldDef,
  OutfitType,
  Wearer,
} from "../../lib/customizationFields";
import { getOptionSketch } from "../../lib/sketchRegistry";
import OptionCard from "./OptionCard";
import SwatchGroup from "./SwatchGroup";
import TailoringIcon from "./TailoringIcons";

const gridClass = (field: FieldDef) =>
  field.crop === "figure"
    ? "grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
    : "grid grid-cols-3 gap-2.5 md:grid-cols-4 md:gap-4";

interface OptionSectionProps {
  field: FieldDef;
  outfitType: OutfitType;
  wearer: Wearer | undefined;
  value: string | undefined;
  onSelect: (option: string) => void;
}

const OptionSection = ({
  field,
  outfitType,
  wearer,
  value,
  onSelect,
}: OptionSectionProps) => {
  const headingId = `field-${field.name}`;
  const note = value ? field.notes?.[value] : undefined;

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4 md:gap-5">
      <header className="flex flex-col gap-1.5">
        <h2
          id={headingId}
          className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink md:text-xs"
        >
          {field.label}
          {field.required === false && (
            <span className="ml-2 normal-case tracking-normal text-muted">
              (optional)
            </span>
          )}
        </h2>
        <p className="text-[13px] leading-normal text-muted md:text-sm">
          {field.description}
        </p>
      </header>

      {field.kind === "swatch" ? (
        <SwatchGroup
          labelledBy={headingId}
          options={field.options}
          value={value}
          onSelect={onSelect}
        />
      ) : (
        <div role="group" aria-labelledby={headingId} className={gridClass(field)}>
          {field.options.map((option) => {
            const icon = field.icons?.[option];
            return (
              <OptionCard
                key={option}
                label={option}
                crop={field.crop}
                image={getOptionSketch({
                  outfitType,
                  wearer,
                  field: field.name,
                  option,
                })}
                fallbackIcon={
                  icon ? (
                    <TailoringIcon
                      variant={icon}
                      className={field.crop === "figure" ? "h-24 w-16" : "h-14 w-14"}
                    />
                  ) : null
                }
                selected={value === option}
                onSelect={() => onSelect(option)}
              />
            );
          })}
        </div>
      )}

      {note && (
        <p aria-live="polite" className="font-display text-lg italic text-ink/80">
          {note}
        </p>
      )}
    </section>
  );
};

export default OptionSection;
