// Measuring guide data for the Step 5 croquis: where each line sits on the
// figure, and how to take that measurement.
//
// Coordinates sit in a 0 0 120 160 viewBox over the croquis image and are
// PLACEHOLDERS until the croquis artwork arrives: re-measure them against the
// delivered files. Guide names must match the field names in StepMeasurement
// exactly, or the numbering silently stops matching.

export interface Guide {
  readonly name: string;
  readonly path: string;
  readonly marker: { readonly x: number; readonly y: number };
}

export const MALE_GUIDES: readonly Guide[] = [
  { name: "Chest", path: "M39.5,48 L80.5,48", marker: { x: 97, y: 48 } },
  { name: "Waist", path: "M40.6,64 L79.4,64", marker: { x: 97, y: 64 } },
  { name: "Hips", path: "M39.3,80 L80.7,80", marker: { x: 97, y: 80 } },
  {
    name: "Shoulder Width",
    path: "M40,24 L80,24",
    marker: { x: 32, y: 24 },
  },
  { name: "Sleeve Length", path: "M83,28 L92,80", marker: { x: 93, y: 30 } },
  { name: "Inseam", path: "M59,95 L53,122 L52,148", marker: { x: 60.5, y: 112 } },
  { name: "Height", path: "M104,4 L104,150", marker: { x: 111, y: 77 } },
];

export const FEMALE_GUIDES: readonly Guide[] = [
  { name: "Bust", path: "M41,46 L79,46", marker: { x: 97, y: 46 } },
  { name: "Under Bust", path: "M42,53 L78,53", marker: { x: 97, y: 55 } },
  { name: "Waist", path: "M43,62 L77,62", marker: { x: 97, y: 64 } },
  { name: "Hips", path: "M38,78 L82,78", marker: { x: 97, y: 78 } },
  { name: "Shoulder Width", path: "M42,25 L78,25", marker: { x: 32, y: 25 } },
  { name: "Arm Length", path: "M82,28 L90,78", marker: { x: 92, y: 30 } },
  { name: "Height", path: "M104,4 L104,150", marker: { x: 111, y: 77 } },
];

export const HOW_TO_MEASURE: Readonly<Record<string, string>> = {
  Chest:
    "Wrap the tape around the fullest part of the chest, under the arms. Keep it level and loose enough to slide one finger beneath.",
  Bust: "Measure around the fullest part of the bust, keeping the tape level across the back.",
  "Under Bust": "Measure directly beneath the bust, snug but not tight.",
  Waist:
    "Measure around the natural waist, the narrowest part of the torso.",
  Hips: "Stand with feet together and measure around the fullest part of the hips and seat.",
  "Shoulder Width":
    "Measure across the back from one shoulder point to the other.",
  "Sleeve Length":
    "With the arm slightly bent, measure from the shoulder point down the outside of the arm to the wrist bone.",
  "Arm Length":
    "With the arm slightly bent, measure from the shoulder point down the outside of the arm to the wrist bone.",
  Inseam: "Measure from the top of the inner thigh down to the ankle bone.",
  Height:
    "Stand barefoot against a wall and measure from the floor to the top of the head.",
  Neck: "Measure around the base of the neck, then add a finger's width of ease.",
  Wrist: "Measure around the wrist bone.",
  Thigh: "Measure around the fullest part of the upper thigh.",
  Calf: "Measure around the fullest part of the calf.",
  "Dress Length":
    "Measure from the shoulder straight down to the floor, for a full-length garment.",
  "Shirt / Buba Length":
    "Measure from the shoulder down to where you want the hem of the shirt or buba to sit.",
};

export const guideNumber = (
  guides: readonly Guide[],
  name: string,
): number | undefined => {
  const index = guides.findIndex((guide) => guide.name === name);
  return index === -1 ? undefined : index + 1;
};
