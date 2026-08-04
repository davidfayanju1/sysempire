// lib/bodyMeasurement.ts
//
// Shared pose-landmark math for the camera self-measurement feature. Used by both
// the Personal Fit order flow and the Profile "Take Measurement" tab so the two
// surfaces don't maintain independently-diverging copies of the same formulas.

export interface Measurement {
  name: string;
  value: number;
  unit: string;
  description: string;
}

export interface PoseLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface GestureState {
  isRaised: boolean;
  handSide: "left" | "right" | null;
  confidence: number;
}

// MediaPipe Pose Landmark indices.
export const LANDMARKS = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
} as const;

export const DISCLAIMER =
  "These measurements are camera-based estimates from a guided front-and-side scan of your body proportions. Expected accuracy is ±2–5 cm depending on camera angle, distance, clothing, body position, and lighting conditions. They're intended as a tailoring guide only — not a substitute for measurements taken by a professional tailor. For precision garments (bridal, ceremonial, or formal wear), we strongly recommend having your measurements verified by an experienced tailor before fabric is cut. SYS EMPIRE accepts no liability for fit discrepancies arising solely from camera-estimated measurements.";

export const detectRaisedHand = (landmarks: PoseLandmark[]): GestureState => {
  const lw = landmarks[LANDMARKS.LEFT_WRIST];
  const rw = landmarks[LANDMARKS.RIGHT_WRIST];
  const ls = landmarks[LANDMARKS.LEFT_SHOULDER];
  const rs = landmarks[LANDMARKS.RIGHT_SHOULDER];

  if (lw && ls && (lw.visibility ?? 0) > 0.6 && lw.y < ls.y) {
    return { isRaised: true, handSide: "left", confidence: lw.visibility ?? 0 };
  }
  if (rw && rs && (rw.visibility ?? 0) > 0.6 && rw.y < rs.y) {
    return { isRaised: true, handSide: "right", confidence: rw.visibility ?? 0 };
  }
  return { isRaised: false, handSide: null, confidence: 0 };
};

export const calculatePoseQuality = (landmarks: PoseLandmark[]): number => {
  const key = [
    LANDMARKS.LEFT_SHOULDER,
    LANDMARKS.RIGHT_SHOULDER,
    LANDMARKS.LEFT_HIP,
    LANDMARKS.RIGHT_HIP,
    LANDMARKS.LEFT_KNEE,
    LANDMARKS.RIGHT_KNEE,
    LANDMARKS.LEFT_ANKLE,
    LANDMARKS.RIGHT_ANKLE,
  ];
  const valid = key.filter((i) => (landmarks[i]?.visibility ?? 0) > 0.5).length;
  let score = valid / key.length;

  const ls = landmarks[LANDMARKS.LEFT_SHOULDER];
  const rs = landmarks[LANDMARKS.RIGHT_SHOULDER];
  if (ls && rs) {
    const cx = (ls.x + rs.x) / 2;
    if (cx > 0.3 && cx < 0.7) score += 0.2;
  }
  return Math.min(score, 1);
};

export interface FramingState {
  headVisible: boolean;
  feetVisible: boolean;
  isFullyFramed: boolean;
}

// Whether the camera can actually see the person's head AND feet — required
// before a capture is allowed, since height (and everything scaled from it)
// is only trustworthy when the full body is in frame. Uses landmark
// visibility scores rather than the generic pose-quality score, which can
// stay high (shoulders/hips/knees all confident) even when the head or feet
// are cropped out of the shot.
export const checkFraming = (landmarks: PoseLandmark[]): FramingState => {
  const nose = landmarks[LANDMARKS.NOSE];
  const lAnkle = landmarks[LANDMARKS.LEFT_ANKLE];
  const rAnkle = landmarks[LANDMARKS.RIGHT_ANKLE];
  const lHeel = landmarks[LANDMARKS.LEFT_HEEL];
  const rHeel = landmarks[LANDMARKS.RIGHT_HEEL];

  const headVisible = (nose?.visibility ?? 0) > 0.5;
  const leftFootVisible =
    (lAnkle?.visibility ?? 0) > 0.4 && (lHeel?.visibility ?? 0) > 0.3;
  const rightFootVisible =
    (rAnkle?.visibility ?? 0) > 0.4 && (rHeel?.visibility ?? 0) > 0.3;
  const feetVisible = leftFootVisible || rightFootVisible;

  return { headVisible, feetVisible, isFullyFramed: headVisible && feetVisible };
};

export const calculateHeightFromLandmarks = (
  worldLandmarks: PoseLandmark[],
): number | null => {
  if (!worldLandmarks || worldLandmarks.length < 32) return null;
  const nose = worldLandmarks[LANDMARKS.NOSE];
  const lHeel = worldLandmarks[LANDMARKS.LEFT_HEEL];
  const rHeel = worldLandmarks[LANDMARKS.RIGHT_HEEL];
  const lFoot = worldLandmarks[LANDMARKS.LEFT_FOOT_INDEX];
  const rFoot = worldLandmarks[LANDMARKS.RIGHT_FOOT_INDEX];
  if (!nose || !lHeel || !rHeel) return null;

  const feetY = Math.max(
    lHeel.y ?? 0,
    rHeel.y ?? 0,
    lFoot?.y ?? 0,
    rFoot?.y ?? 0,
  );
  const heightCm = Math.abs(feetY - nose.y) * 100 * 1.8;
  return heightCm > 140 && heightCm < 220 ? Math.round(heightCm) : 170;
};

// Ramanujan's first approximation of an ellipse's perimeter, given the two
// semi-axes (half-width, half-depth) in cm. Used to turn a front width + a side
// depth into a real circumference instead of a guessed multiplier.
export const ellipseCircumference = (semiA: number, semiB: number): number => {
  const a = Math.max(semiA, 0.1);
  const b = Math.max(semiB, 0.1);
  return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
};

export interface FrontGeometry {
  shoulderWidth: number; // cm, height-scaled
  hipWidth: number; // cm, height-scaled
  torsoLength: number; // cm, height-scaled
  avgArmLength: number; // cm, height-scaled
  avgLegLength: number; // cm, height-scaled
  heightCm: number;
}

// Extract raw body geometry (in real-world cm) from a front-facing capture's
// world landmarks. Widths/lengths are scaled by the detected height relative to
// an average 170cm reference, same as the original single-photo formulas.
export const computeFrontGeometry = (
  worldLandmarks: PoseLandmark[],
  heightCm: number,
): FrontGeometry => {
  const w = worldLandmarks;
  const ls = w[LANDMARKS.LEFT_SHOULDER];
  const rs = w[LANDMARKS.RIGHT_SHOULDER];
  const lh = w[LANDMARKS.LEFT_HIP];
  const rh = w[LANDMARKS.RIGHT_HIP];
  const lw = w[LANDMARKS.LEFT_WRIST];
  const rw = w[LANDMARKS.RIGHT_WRIST];
  const la = w[LANDMARKS.LEFT_ANKLE];
  const ra = w[LANDMARKS.RIGHT_ANKLE];

  const shoulderWidth = Math.abs((ls?.x ?? 0) - (rs?.x ?? 0)) * 100;
  const hipWidth = Math.abs((lh?.x ?? 0) - (rh?.x ?? 0)) * 100;
  const torsoLength = Math.abs((ls?.y ?? 0) - (lh?.y ?? 0)) * 100;
  const leftArm = Math.abs((ls?.y ?? 0) - (lw?.y ?? 0)) * 100;
  const rightArm = Math.abs((rs?.y ?? 0) - (rw?.y ?? 0)) * 100;
  const leftLeg = Math.abs((lh?.y ?? 0) - (la?.y ?? 0)) * 100;
  const rightLeg = Math.abs((rh?.y ?? 0) - (ra?.y ?? 0)) * 100;

  const sf = heightCm / 170; // scale relative to average height

  return {
    shoulderWidth: shoulderWidth * sf,
    hipWidth: hipWidth * sf,
    torsoLength: torsoLength * sf,
    avgArmLength: ((leftArm + rightArm) / 2) * sf,
    avgLegLength: ((leftLeg + rightLeg) / 2) * sf,
    heightCm,
  };
};

export interface SideDepths {
  bustDepth: number; // cm
  waistDepth: number; // cm
  hipDepth: number; // cm
}

export interface SideDepthInput {
  /** Person-segmentation mask for the captured side frame, one byte per pixel. */
  mask: Uint8Array;
  maskWidth: number;
  maskHeight: number;
  /** Predicate identifying a mask value as "this pixel is the person". */
  isForeground: (value: number) => boolean;
  /** Normalized (0–1) landmark positions from PoseLandmarker on this same side frame. */
  noseY: number;
  shoulderY: number;
  hipY: number;
  heelY: number;
  /** Already-known real height (from the front capture), to derive a px→cm scale. */
  heightCm: number;
}

const silhouetteWidthAt = (
  mask: Uint8Array,
  maskWidth: number,
  maskHeight: number,
  isForeground: (value: number) => boolean,
  yNorm: number,
): number | null => {
  const row = Math.min(
    maskHeight - 1,
    Math.max(0, Math.round(yNorm * maskHeight)),
  );
  const rowStart = row * maskWidth;
  let left = -1;
  let right = -1;
  for (let x = 0; x < maskWidth; x++) {
    if (isForeground(mask[rowStart + x])) {
      if (left === -1) left = x;
      right = x;
    }
  }
  if (left === -1 || right === -1) return null;
  return right - left;
};

// Derive real front-to-back body depth at bust/waist/hip level from a side-profile
// segmentation mask. Returns null if the silhouette can't be read at any of the
// three bands (e.g. poor framing) — callers should fall back to the multiplier
// estimate in that case rather than produce a partial/broken result.
export const computeSideDepths = (input: SideDepthInput): SideDepths | null => {
  const {
    mask,
    maskWidth,
    maskHeight,
    isForeground,
    noseY,
    shoulderY,
    hipY,
    heelY,
    heightCm,
  } = input;

  const pxHeight = Math.abs(heelY - noseY) * maskHeight;
  if (pxHeight < 10) return null;
  const pxPerCm = pxHeight / heightCm;

  const torsoSpan = hipY - shoulderY;
  const bustY = shoulderY + torsoSpan * 0.3;
  const waistY = shoulderY + torsoSpan * 0.72;
  const hipBandY = hipY;

  const bustPx = silhouetteWidthAt(mask, maskWidth, maskHeight, isForeground, bustY);
  const waistPx = silhouetteWidthAt(mask, maskWidth, maskHeight, isForeground, waistY);
  const hipPx = silhouetteWidthAt(mask, maskWidth, maskHeight, isForeground, hipBandY);

  if (bustPx === null || waistPx === null || hipPx === null) return null;

  return {
    bustDepth: bustPx / pxPerCm,
    waistDepth: waistPx / pxPerCm,
    hipDepth: hipPx / pxPerCm,
  };
};

const BUST_MULTIPLIER = { female: 2.5, male: 2.45 };
const WAIST_MULTIPLIER = { female: 2.0, male: 2.3 };
const HIP_MULTIPLIER = { female: 2.8, male: 2.6 };

// Builds the final measurement list. When `sideDepths` is available, Bust/Chest,
// Waist and Hips are computed from real front-width + side-depth geometry via an
// ellipse approximation. Otherwise they fall back to the population-average
// multiplier estimate (today's behavior) so the feature still works end-to-end
// if the side scan is skipped or segmentation fails to load.
export const buildMeasurements = (
  front: FrontGeometry,
  sideDepths: SideDepths | null,
  gender: "male" | "female",
): Measurement[] => {
  const { shoulderWidth: sw, hipWidth: hw, torsoLength: tl, avgArmLength: avgArm, avgLegLength: avgLeg, heightCm } = front;

  const bustCirc = sideDepths
    ? ellipseCircumference(sw / 2, sideDepths.bustDepth / 2)
    : sw * BUST_MULTIPLIER[gender];
  const waistCirc = sideDepths
    ? ellipseCircumference(hw / 2, sideDepths.waistDepth / 2)
    : hw * WAIST_MULTIPLIER[gender];
  const hipCirc = sideDepths
    ? ellipseCircumference(hw / 2, sideDepths.hipDepth / 2)
    : hw * HIP_MULTIPLIER[gender];

  if (gender === "female") {
    return [
      { name: "Height", value: heightCm, unit: "cm", description: "Total standing height" },
      { name: "Shoulder Width", value: Math.round(sw), unit: "cm", description: "Shoulder point to shoulder point (back)" },
      { name: "Bust", value: Math.round(bustCirc), unit: "cm", description: "Fullest part of chest — at nipple line" },
      { name: "Under Bust", value: Math.round(sw * 2.1), unit: "cm", description: "Directly below bust" },
      { name: "Waist", value: Math.round(waistCirc), unit: "cm", description: "Narrowest part of natural waist" },
      { name: "Hips", value: Math.round(hipCirc), unit: "cm", description: "Fullest part of hips and seat" },
      { name: "Neck", value: Math.round(sw * 0.58), unit: "cm", description: "Around the base of neck" },
      { name: "Arm Length", value: Math.round(avgArm), unit: "cm", description: "Shoulder point to wrist bone" },
      { name: "Wrist", value: Math.round(avgArm * 0.11), unit: "cm", description: "Around the wrist bone" },
      { name: "Thigh", value: Math.round(avgLeg * 0.32), unit: "cm", description: "Fullest part of upper thigh" },
      { name: "Calf", value: Math.round(avgLeg * 0.2), unit: "cm", description: "Fullest part of calf" },
      { name: "Dress Length", value: Math.round(tl + avgLeg * 0.85), unit: "cm", description: "Shoulder to floor (full-length garment)" },
      { name: "Torso Length", value: Math.round(tl), unit: "cm", description: "Shoulder to natural waist" },
    ];
  }

  return [
    { name: "Height", value: heightCm, unit: "cm", description: "Total standing height" },
    { name: "Shoulder Width", value: Math.round(sw), unit: "cm", description: "Shoulder point to shoulder point (back)" },
    { name: "Chest", value: Math.round(bustCirc), unit: "cm", description: "Fullest part of chest — across shoulder blades" },
    { name: "Waist", value: Math.round(waistCirc), unit: "cm", description: "Narrowest part of natural waist" },
    { name: "Hips", value: Math.round(hipCirc), unit: "cm", description: "Fullest part of the seat" },
    { name: "Neck", value: Math.round(sw * 0.67), unit: "cm", description: "Around base of neck + 1 cm ease" },
    { name: "Sleeve Length", value: Math.round(avgArm), unit: "cm", description: "Shoulder point to wrist (arm slightly bent)" },
    { name: "Wrist", value: Math.round(avgArm * 0.13), unit: "cm", description: "Around the wrist bone" },
    { name: "Thigh", value: Math.round(avgLeg * 0.28), unit: "cm", description: "Fullest part of upper thigh" },
    { name: "Inseam", value: Math.round(avgLeg), unit: "cm", description: "Crotch to ankle (inner leg)" },
    { name: "Jacket Length", value: Math.round(tl * 1.75), unit: "cm", description: "Natural waist to hem (suit / agbada)" },
    { name: "Torso Length", value: Math.round(tl), unit: "cm", description: "Shoulder to natural waist" },
  ];
};
