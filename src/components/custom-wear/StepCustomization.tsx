import { useState } from "react";
import {
  applySelection,
  clearField,
  deriveWearer,
  getFields,
  isComplete,
  pickVisible,
  type Customizations,
  type FieldDef,
  type OutfitType,
  type Wearer,
} from "../../lib/customizationFields";
import { getPreviewSketch } from "../../lib/sketchRegistry";
import GarmentSummary from "./GarmentSummary";
import MobileSummary from "./MobileSummary";
import GarmentSketchPreview from "./GarmentSketchPreview";
import OptionSection from "./OptionSection";

interface StepCustomizationProps {
  outfitType: OutfitType;
  initialValues?: Customizations;
  estimate: (values: Customizations) => number;
  onNext: (values: Customizations, wearer: Wearer | undefined) => void;
  onBack: () => void;
}

const StepCustomization = ({
  outfitType,
  initialValues,
  estimate,
  onNext,
  onBack,
}: StepCustomizationProps) => {
  const [values, setValues] = useState<Customizations>(initialValues ?? {});

  // All derived during render: no effects, nothing to keep in sync.
  const fields = getFields(outfitType, values);
  const wearer = deriveWearer(outfitType, values);
  const complete = isComplete(fields, values);
  const preview = getPreviewSketch(outfitType, wearer, values);

  // Until the drawn artwork lands, the panel shows a live croquis built from
  // the answers so far.
  const liveSketch = (compact: boolean) => (
    <GarmentSketchPreview
      outfitType={outfitType}
      wearer={wearer}
      values={values}
      compact={compact}
      className="h-full w-full"
    />
  );
  const total = estimate(values);
  const summary = fields
    .map((field) => values[field.name])
    .filter(Boolean)
    .join(" · ");

  const select = (field: FieldDef, option: string) =>
    setValues((current) =>
      field.required === false && current[field.name] === option
        ? clearField(current, field.name)
        : applySelection(current, field.name, option),
    );

  const handleContinue = () => {
    if (complete) onNext(pickVisible(fields, values), wearer);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 md:px-8 lg:pb-0">
      <header className="flex flex-col items-center gap-3.5 pb-10 pt-4 text-center md:pb-16">
        <p className="text-[11px] tracking-[0.32em] text-accent">
          STEP 04 · DETAILS
        </p>
        <h1 className="font-display text-4xl font-normal leading-none text-ink md:text-6xl">
          Shape your garment
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted md:text-base">
          Each option is drawn the way your tailor will cut it.
        </p>
      </header>

      <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
        <div className="flex flex-col gap-10 md:gap-16">
          <MobileSummary
            className="lg:hidden"
            image={preview}
            fallback={liveSketch(true)}
            summary={summary}
            estimate={total}
          />

          {fields.map((field) => (
            <OptionSection
              key={field.name}
              field={field}
              outfitType={outfitType}
              wearer={wearer}
              value={values[field.name]}
              onSelect={(option) => select(field, option)}
            />
          ))}

          {/* One Continue button: a fixed bar on mobile, inline on desktop. */}
          <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t border-line bg-white px-5 py-4 lg:static lg:justify-between lg:bg-transparent lg:px-0 lg:pt-8">
            <button
              type="button"
              onClick={onBack}
              className="flex h-13 min-w-13 cursor-pointer items-center justify-center border border-line px-4 text-[13px] tracking-[0.08em] text-muted lg:border-0 lg:px-0"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={!complete}
              className="h-13 flex-1 cursor-pointer bg-ink px-12 text-xs uppercase tracking-[0.24em] text-white disabled:cursor-not-allowed disabled:bg-line disabled:text-muted lg:h-14 lg:flex-none"
            >
              Continue
            </button>
          </div>
        </div>

        <GarmentSummary
          className="hidden lg:sticky lg:top-28 lg:flex"
          image={preview}
          fallback={liveSketch(false)}
          fields={fields}
          values={values}
          estimate={total}
        />
      </div>
    </div>
  );
};

export default StepCustomization;
