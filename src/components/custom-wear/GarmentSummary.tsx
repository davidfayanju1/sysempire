import type { ReactNode } from "react";
import type { Customizations, FieldDef } from "../../lib/customizationFields";
import { formatNaira } from "../../lib/format";

interface GarmentSummaryProps {
  image: string | undefined;
  /** Shown until the sketch for the current garment has been drawn. */
  fallback: ReactNode;
  fields: readonly FieldDef[];
  values: Customizations;
  estimate: number;
  className?: string;
}

const GarmentSummary = ({
  image,
  fallback,
  fields,
  values,
  estimate,
  className = "",
}: GarmentSummaryProps) => {
  return (
    <aside
      aria-label="Your garment"
      className={`flex-col gap-5 border border-line bg-white p-7 ${className}`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-3xl font-normal text-ink">
          Your garment
        </h2>
        <span className="text-[10px] tracking-[0.2em] text-muted">
          UPDATES AS YOU CHOOSE
        </span>
      </div>

      <div className="flex aspect-3/4 items-center justify-center bg-paper p-6 text-neutral-500">
        {image ? (
          // Keying by src remounts the image on every change, replaying the fade.
          <img
            key={image}
            src={image}
            alt=""
            className="h-full w-full object-contain p-4 motion-safe:animate-fade-in"
          />
        ) : (
          fallback
        )}
      </div>

      <dl>
        {fields.map((field) => {
          const value = values[field.name];
          return (
            <div
              key={field.name}
              className="flex justify-between gap-4 border-b border-[#F0EBE3] py-2.5 last:border-b-0"
            >
              <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                {field.summaryLabel ?? field.label}
              </dt>
              <dd
                className={`text-right text-sm ${value ? "text-ink" : "text-muted"}`}
              >
                {value ?? "Not chosen"}
              </dd>
            </div>
          );
        })}
      </dl>

      <div className="flex items-baseline justify-between border-t border-ink pt-4">
        <span className="text-xs tracking-[0.16em] text-ink">
          ESTIMATED FROM
        </span>
        <span className="font-display text-3xl text-ink">
          {formatNaira(estimate)}
        </span>
      </div>
      <p className="text-[13px] leading-relaxed text-muted">
        Final price is confirmed after your stylist consultation.
      </p>
    </aside>
  );
};

export default GarmentSummary;
