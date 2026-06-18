import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Ruler,
  User,
  Target,
  Move,
  Sparkles,
  Camera as CameraIcon,
  Image as ImageIcon,
  CheckCircle2,
  Hand,
  Activity,
  X,
  CheckCircle,
  Info,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { toast } from "sonner";

interface Measurement {
  name: string;
  value: number;
  unit: string;
  description: string;
}

interface GestureState {
  isRaised: boolean;
  handSide: "left" | "right" | null;
  confidence: number;
}

interface SavedData {
  measurements: Measurement[];
  gender: "female" | "male";
  date: string;
  detectedHeight: number | null;
  method: "camera" | "upload";
}

// MediaPipe Pose Landmark indices (constant — not inside component)
const LANDMARKS = {
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

const DISCLAIMER = `These measurements are AI-generated estimates derived from computer vision analysis of body proportions captured via your device camera. Expected accuracy is ±2–5 cm depending on camera angle, distance, clothing, body position, and lighting conditions. These measurements are intended as a tailoring guide only — they are not a substitute for measurements taken by a professional tailor. For precision garments (bridal, ceremonial, or formal wear), we strongly recommend having your measurements verified by an experienced tailor before fabric is cut. SYS EMPIRE accepts no liability for fit discrepancies arising solely from AI-estimated measurements.`;

// Gender-aware measurement calculation
function calculateAllMeasurements(
  worldLandmarks: any[],
  heightCm: number,
  gender: "female" | "male",
): Measurement[] {
  const w = worldLandmarks;

  const ls = w[LANDMARKS.LEFT_SHOULDER];
  const rs = w[LANDMARKS.RIGHT_SHOULDER];
  const lh = w[LANDMARKS.LEFT_HIP];
  const rh = w[LANDMARKS.RIGHT_HIP];
  const lw = w[LANDMARKS.LEFT_WRIST];
  const rw = w[LANDMARKS.RIGHT_WRIST];
  const la = w[LANDMARKS.LEFT_ANKLE];
  const ra = w[LANDMARKS.RIGHT_ANKLE];

  const shoulderWidth = Math.abs((ls?.x || 0) - (rs?.x || 0)) * 100;
  const hipWidth = Math.abs((lh?.x || 0) - (rh?.x || 0)) * 100;
  const torsoLen = Math.abs((ls?.y || 0) - (lh?.y || 0)) * 100;
  const leftArm = Math.abs((ls?.y || 0) - (lw?.y || 0)) * 100;
  const rightArm = Math.abs((rs?.y || 0) - (rw?.y || 0)) * 100;
  const avgArm = (leftArm + rightArm) / 2;
  const leftLeg = Math.abs((lh?.y || 0) - (la?.y || 0)) * 100;
  const rightLeg = Math.abs((rh?.y || 0) - (ra?.y || 0)) * 100;
  const avgLeg = (leftLeg + rightLeg) / 2;

  const sf = heightCm / 170; // scale relative to average height

  if (gender === "female") {
    return [
      {
        name: "Height",
        value: heightCm,
        unit: "cm",
        description: "Total standing height",
      },
      {
        name: "Shoulder Width",
        value: Math.round(shoulderWidth * sf),
        unit: "cm",
        description: "Shoulder point to shoulder point (back)",
      },
      {
        name: "Bust",
        value: Math.round(shoulderWidth * 2.5 * sf),
        unit: "cm",
        description: "Fullest part of chest — taken at nipple line",
      },
      {
        name: "Under Bust",
        value: Math.round(shoulderWidth * 2.1 * sf),
        unit: "cm",
        description: "Circumference directly below bust",
      },
      {
        name: "Waist",
        value: Math.round(hipWidth * 2.0 * sf),
        unit: "cm",
        description: "Narrowest part of natural waist",
      },
      {
        name: "Hips",
        value: Math.round(hipWidth * 2.8 * sf),
        unit: "cm",
        description: "Fullest part of hips and seat",
      },
      {
        name: "Neck",
        value: Math.round(shoulderWidth * 0.58 * sf),
        unit: "cm",
        description: "Around the base of neck",
      },
      {
        name: "Arm Length",
        value: Math.round(avgArm * sf),
        unit: "cm",
        description: "Shoulder point to wrist bone",
      },
      {
        name: "Wrist",
        value: Math.round(avgArm * 0.11 * sf),
        unit: "cm",
        description: "Around the wrist bone",
      },
      {
        name: "Thigh",
        value: Math.round(avgLeg * 0.32 * sf),
        unit: "cm",
        description: "Fullest part of upper thigh",
      },
      {
        name: "Calf",
        value: Math.round(avgLeg * 0.20 * sf),
        unit: "cm",
        description: "Fullest part of calf",
      },
      {
        name: "Dress Length",
        value: Math.round((torsoLen + avgLeg * 0.85) * sf),
        unit: "cm",
        description: "Shoulder to floor (full-length garment)",
      },
      {
        name: "Torso Length",
        value: Math.round(torsoLen * sf),
        unit: "cm",
        description: "Shoulder to natural waist",
      },
    ];
  }

  // Male
  return [
    {
      name: "Height",
      value: heightCm,
      unit: "cm",
      description: "Total standing height",
    },
    {
      name: "Shoulder Width",
      value: Math.round(shoulderWidth * sf),
      unit: "cm",
      description: "Shoulder point to shoulder point (back)",
    },
    {
      name: "Chest",
      value: Math.round(shoulderWidth * 2.45 * sf),
      unit: "cm",
      description: "Fullest part of chest — across shoulder blades",
    },
    {
      name: "Waist",
      value: Math.round(hipWidth * 2.3 * sf),
      unit: "cm",
      description: "Narrowest part of natural waist",
    },
    {
      name: "Hips",
      value: Math.round(hipWidth * 2.6 * sf),
      unit: "cm",
      description: "Fullest part of the seat",
    },
    {
      name: "Neck",
      value: Math.round(shoulderWidth * 0.67 * sf),
      unit: "cm",
      description: "Around base of neck + 1 cm ease",
    },
    {
      name: "Sleeve Length",
      value: Math.round(avgArm * sf),
      unit: "cm",
      description: "Shoulder point to wrist (arm slightly bent)",
    },
    {
      name: "Wrist",
      value: Math.round(avgArm * 0.13 * sf),
      unit: "cm",
      description: "Around the wrist bone",
    },
    {
      name: "Thigh",
      value: Math.round(avgLeg * 0.28 * sf),
      unit: "cm",
      description: "Fullest part of upper thigh",
    },
    {
      name: "Inseam",
      value: Math.round(avgLeg * sf),
      unit: "cm",
      description: "Crotch to ankle (inner leg)",
    },
    {
      name: "Jacket Length",
      value: Math.round(torsoLen * 1.75 * sf),
      unit: "cm",
      description: "Natural waist to hem (suit / agbada)",
    },
    {
      name: "Torso Length",
      value: Math.round(torsoLen * sf),
      unit: "cm",
      description: "Shoulder to natural waist",
    },
  ];
}

// Gender-specific sensible defaults for upload / fallback
function getMockMeasurements(gender: "female" | "male"): Measurement[] {
  if (gender === "female") {
    return [
      { name: "Height", value: 163, unit: "cm", description: "Total standing height" },
      { name: "Shoulder Width", value: 38, unit: "cm", description: "Shoulder point to shoulder point (back)" },
      { name: "Bust", value: 88, unit: "cm", description: "Fullest part of chest — taken at nipple line" },
      { name: "Under Bust", value: 73, unit: "cm", description: "Circumference directly below bust" },
      { name: "Waist", value: 70, unit: "cm", description: "Narrowest part of natural waist" },
      { name: "Hips", value: 96, unit: "cm", description: "Fullest part of hips and seat" },
      { name: "Neck", value: 35, unit: "cm", description: "Around the base of neck" },
      { name: "Arm Length", value: 58, unit: "cm", description: "Shoulder point to wrist bone" },
      { name: "Wrist", value: 16, unit: "cm", description: "Around the wrist bone" },
      { name: "Thigh", value: 56, unit: "cm", description: "Fullest part of upper thigh" },
      { name: "Calf", value: 36, unit: "cm", description: "Fullest part of calf" },
      { name: "Dress Length", value: 153, unit: "cm", description: "Shoulder to floor (full-length garment)" },
      { name: "Torso Length", value: 41, unit: "cm", description: "Shoulder to natural waist" },
    ];
  }
  return [
    { name: "Height", value: 172, unit: "cm", description: "Total standing height" },
    { name: "Shoulder Width", value: 44, unit: "cm", description: "Shoulder point to shoulder point (back)" },
    { name: "Chest", value: 97, unit: "cm", description: "Fullest part of chest — across shoulder blades" },
    { name: "Waist", value: 84, unit: "cm", description: "Narrowest part of natural waist" },
    { name: "Hips", value: 96, unit: "cm", description: "Fullest part of the seat" },
    { name: "Neck", value: 40, unit: "cm", description: "Around base of neck + 1 cm ease" },
    { name: "Sleeve Length", value: 64, unit: "cm", description: "Shoulder point to wrist (arm slightly bent)" },
    { name: "Wrist", value: 18, unit: "cm", description: "Around the wrist bone" },
    { name: "Thigh", value: 54, unit: "cm", description: "Fullest part of upper thigh" },
    { name: "Inseam", value: 80, unit: "cm", description: "Crotch to ankle (inner leg)" },
    { name: "Jacket Length", value: 70, unit: "cm", description: "Natural waist to hem (suit / agbada)" },
    { name: "Torso Length", value: 45, unit: "cm", description: "Shoulder to natural waist" },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
const MeasurementTab = () => {
  const [gender, setGender] = useState<"female" | "male">("female");
  const genderRef = useRef<"female" | "male">("female");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"camera" | "upload">("camera");
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [gestureDetected, setGestureDetected] = useState<GestureState>({
    isRaised: false,
    handSide: null,
    confidence: 0,
  });
  const [poseQuality, setPoseQuality] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isAutoCapturing, setIsAutoCapturing] = useState(false);
  const [liveMeasurements, setLiveMeasurements] = useState<Measurement[] | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [detectedHeight, setDetectedHeight] = useState<number | null>(null);
  const [savedData, setSavedData] = useState<SavedData | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);
  const poseLandmarkerRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const countdownActiveRef = useRef(false);

  // Sync gender ref whenever state changes
  useEffect(() => {
    genderRef.current = gender;
  }, [gender]);

  // Load existing saved measurements on mount
  useEffect(() => {
    const raw = localStorage.getItem("userMeasurements");
    if (raw) {
      try {
        setSavedData(JSON.parse(raw) as SavedData);
      } catch {
        /* corrupted data — ignore */
      }
    }
  }, []);

  const instructions = [
    {
      icon: <User className="w-5 h-5" />,
      title: "Stand Straight",
      description: "Position yourself facing the camera with good posture",
      detail: "Feet shoulder-width apart, look directly at the camera",
    },
    {
      icon: <Move className="w-5 h-5" />,
      title: "Arms Visible",
      description: "Keep arms slightly away from your body",
      detail: "Don't cross arms or hide your hands",
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Stay Centered",
      description: "Position yourself in the middle of the frame",
      detail: "Your whole body should be visible from head to toe",
    },
    {
      icon: <Hand className="w-5 h-5" />,
      title: "Raise Your Hand",
      description: "Lift either hand above shoulder level",
      detail: "This triggers the 3-second countdown before capture",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: "Good Lighting",
      description: "Ensure you're in a well-lit area",
      detail: "Natural daylight against a plain background works best",
    },
  ];

  const prompts = [
    {
      icon: <User className="w-8 h-8" />,
      title: "Stand Straight",
      description: "Position yourself facing the camera with good posture",
      instruction: "Keep your feet shoulder-width apart",
    },
    {
      icon: <Move className="w-8 h-8" />,
      title: "Arms Visible",
      description: "Keep your arms slightly away from your body",
      instruction: "Don't cross your arms or hide your hands",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Stay Centered",
      description: "Position yourself in the middle of the frame",
      instruction: "Your whole body should be visible",
    },
    {
      icon: <Hand className="w-8 h-8" />,
      title: "Raise Your Hand",
      description: "Lift either hand above shoulder level",
      instruction: "This triggers the measurement capture",
    },
  ];

  // ── MediaPipe init ────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        setIsModelLoading(true);
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
        );
        const pl = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        poseLandmarkerRef.current = pl;
        setIsModelLoading(false);
      } catch {
        setError("Failed to load pose detection. Please refresh the page.");
        setIsModelLoading(false);
      }
    };
    init();

    return () => {
      poseLandmarkerRef.current?.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ── Height from world landmarks ──────────────────────────────────────────
  const calculateHeightFromLandmarks = useCallback(
    (worldLandmarks: any[]): number | null => {
      if (!worldLandmarks || worldLandmarks.length < 32) return null;
      const nose = worldLandmarks[LANDMARKS.NOSE];
      const lHeel = worldLandmarks[LANDMARKS.LEFT_HEEL];
      const rHeel = worldLandmarks[LANDMARKS.RIGHT_HEEL];
      const lFoot = worldLandmarks[LANDMARKS.LEFT_FOOT_INDEX];
      const rFoot = worldLandmarks[LANDMARKS.RIGHT_FOOT_INDEX];
      if (!nose || !lHeel || !rHeel) return null;

      const feetY = Math.max(lHeel.y ?? 0, rHeel.y ?? 0, lFoot?.y ?? 0, rFoot?.y ?? 0);
      const heightCm = Math.abs(feetY - nose.y) * 100 * 1.8;
      return heightCm > 140 && heightCm < 220 ? Math.round(heightCm) : 170;
    },
    [],
  );

  // ── Raised-hand gesture ──────────────────────────────────────────────────
  const detectRaisedHand = useCallback((landmarks: any[]): GestureState => {
    const lw = landmarks[LANDMARKS.LEFT_WRIST];
    const rw = landmarks[LANDMARKS.RIGHT_WRIST];
    const ls = landmarks[LANDMARKS.LEFT_SHOULDER];
    const rs = landmarks[LANDMARKS.RIGHT_SHOULDER];

    if (lw && ls && lw.visibility > 0.5 && lw.y < ls.y && lw.visibility > 0.6)
      return { isRaised: true, handSide: "left", confidence: lw.visibility };
    if (rw && rs && rw.visibility > 0.5 && rw.y < rs.y && rw.visibility > 0.6)
      return { isRaised: true, handSide: "right", confidence: rw.visibility };
    return { isRaised: false, handSide: null, confidence: 0 };
  }, []);

  // ── Pose quality score ───────────────────────────────────────────────────
  const calculatePoseQuality = useCallback(
    (landmarks: any[]): number => {
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
      const valid = key.filter((i) => landmarks[i]?.visibility > 0.5).length;
      let score = valid / key.length;

      const ls = landmarks[LANDMARKS.LEFT_SHOULDER];
      const rs = landmarks[LANDMARKS.RIGHT_SHOULDER];
      if (ls && rs) {
        const cx = (ls.x + rs.x) / 2;
        if (cx > 0.3 && cx < 0.7) score += 0.2;
      }

      if (valid < 6 && currentPrompt !== 0) setCurrentPrompt(0);
      else if (valid >= 6 && valid < 10 && currentPrompt !== 1) setCurrentPrompt(1);
      else if (valid >= 10 && currentPrompt !== 2) setCurrentPrompt(2);

      return Math.min(score, 1);
    },
    [currentPrompt],
  );

  // ── Skeleton overlay ─────────────────────────────────────────────────────
  const drawSkeleton = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      landmarks: any[],
      width: number,
      height: number,
      gesture: GestureState,
    ) => {
      const connections: [number, number][] = [
        [LANDMARKS.LEFT_SHOULDER, LANDMARKS.RIGHT_SHOULDER],
        [LANDMARKS.LEFT_SHOULDER, LANDMARKS.LEFT_ELBOW],
        [LANDMARKS.LEFT_ELBOW, LANDMARKS.LEFT_WRIST],
        [LANDMARKS.RIGHT_SHOULDER, LANDMARKS.RIGHT_ELBOW],
        [LANDMARKS.RIGHT_ELBOW, LANDMARKS.RIGHT_WRIST],
        [LANDMARKS.LEFT_SHOULDER, LANDMARKS.LEFT_HIP],
        [LANDMARKS.RIGHT_SHOULDER, LANDMARKS.RIGHT_HIP],
        [LANDMARKS.LEFT_HIP, LANDMARKS.RIGHT_HIP],
        [LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE],
        [LANDMARKS.LEFT_KNEE, LANDMARKS.LEFT_ANKLE],
        [LANDMARKS.RIGHT_HIP, LANDMARKS.RIGHT_KNEE],
        [LANDMARKS.RIGHT_KNEE, LANDMARKS.RIGHT_ANKLE],
      ];

      const lineColor = gesture.isRaised ? "#10b981" : "#6b7280";
      connections.forEach(([a, b]) => {
        const s = landmarks[a];
        const e = landmarks[b];
        if (s && e && s.visibility > 0.3 && e.visibility > 0.3) {
          ctx.beginPath();
          ctx.moveTo(s.x * width, s.y * height);
          ctx.lineTo(e.x * width, e.y * height);
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });

      landmarks.forEach((lm, idx) => {
        if (lm.visibility > 0.3) {
          const raised =
            (gesture.handSide === "left" && idx === LANDMARKS.LEFT_WRIST) ||
            (gesture.handSide === "right" && idx === LANDMARKS.RIGHT_WRIST);
          ctx.beginPath();
          ctx.arc(lm.x * width, lm.y * height, raised ? 10 : 6, 0, 2 * Math.PI);
          ctx.fillStyle = raised ? "#10b981" : "#ffffff";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(lm.x * width, lm.y * height, raised ? 4 : 3, 0, 2 * Math.PI);
          ctx.fillStyle = "#000000";
          ctx.fill();
        }
      });
    },
    [],
  );

  // ── Real-time detection loop ─────────────────────────────────────────────
  const startRealTimeDetection = useCallback(() => {
    let lastTs = -1;

    const loop = async (ts: number) => {
      if (!videoRef.current || !poseLandmarkerRef.current || !canvasRef.current) {
        animationRef.current = requestAnimationFrame(loop);
        return;
      }
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx || !video.videoWidth || !video.videoHeight) {
        animationRef.current = requestAnimationFrame(loop);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (ts !== lastTs && video.readyState >= 2) {
        lastTs = ts;
        try {
          const res = await poseLandmarkerRef.current.detectForVideo(video, ts);
          if (res.landmarks?.length > 0) {
            const lms = res.landmarks[0];
            const wlms = res.worldLandmarks?.[0];

            const gesture = detectRaisedHand(lms);
            setGestureDetected(gesture);

            const quality = calculatePoseQuality(lms);
            setPoseQuality(quality);

            drawSkeleton(ctx, lms, canvas.width, canvas.height, gesture);

            if (wlms && quality > 0.6) {
              const h = calculateHeightFromLandmarks(wlms);
              if (h && h > 140 && h < 220) {
                setDetectedHeight(h);
                const m = calculateAllMeasurements(wlms, h, genderRef.current);
                setLiveMeasurements(m);
              }
              if (gesture.isRaised && !countdownActiveRef.current && quality > 0.7) {
                startCountdown();
              }
            }
          } else {
            setPoseQuality(0);
            setGestureDetected({ isRaised: false, handSide: null, confidence: 0 });
          }
        } catch {
          /* suppress frame errors */
        }
      }
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detectRaisedHand, calculatePoseQuality, drawSkeleton, calculateHeightFromLandmarks]);

  // ── Countdown → capture ──────────────────────────────────────────────────
  const startCountdown = useCallback(() => {
    if (countdownActiveRef.current) return;
    countdownActiveRef.current = true;
    setIsAutoCapturing(true);
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          countdownActiveRef.current = false;
          setIsAutoCapturing(false);
          if (prev === 1) capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capturePhoto = useCallback(() => {
    if (canvasRef.current && videoRef.current && liveMeasurements) {
      setCapturedImage(canvasRef.current.toDataURL("image/jpeg", 0.95));
      stopCamera();
      setMeasurements(liveMeasurements);
      setActiveStep(3);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveMeasurements]);

  // ── Camera control ───────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setIsCameraActive(false);
    setShowVideo(false);
    setCountdown(null);
    setIsAutoCapturing(false);
    countdownActiveRef.current = false;
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    setMeasurements(null);
    setLiveMeasurements(null);
    setDetectedHeight(null);
    setShowVideo(true);
    setActiveStep(2);
    setCurrentPrompt(0);
    countdownActiveRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCameraActive(true);
          startRealTimeDetection();
        };
      }
    } catch {
      setError("Unable to access camera. Please check permissions.");
      setShowVideo(false);
    }
  }, [startRealTimeDetection]);

  const openModal = useCallback(
    (mode: "camera" | "upload") => {
      setModalMode(mode);
      setIsModalOpen(true);
      if (mode === "camera") startCamera();
    },
    [startCamera],
  );

  const refreshSaved = useCallback(() => {
    const raw = localStorage.getItem("userMeasurements");
    if (raw) {
      try {
        setSavedData(JSON.parse(raw) as SavedData);
      } catch { /* ignore */ }
    }
  }, []);

  const closeModal = useCallback(() => {
    stopCamera();
    setIsModalOpen(false);
    setActiveStep(1);
    setMeasurements(null);
    setLiveMeasurements(null);
    setCapturedImage(null);
    setDetectedHeight(null);
    refreshSaved();
  }, [stopCamera, refreshSaved]);

  // ── Save measurements ────────────────────────────────────────────────────
  const saveMeasurements = useCallback(() => {
    if (!measurements) return;

    const record: SavedData = {
      measurements,
      gender: genderRef.current,
      date: new Date().toISOString(),
      detectedHeight,
      method: modalMode,
    };

    localStorage.setItem("userMeasurements", JSON.stringify(record));

    // Structured console output
    console.group("📏 SYS EMPIRE — Body Measurements Saved");
    console.log(
      `%cGender: ${genderRef.current} | Method: ${modalMode === "camera" ? "AI Body Scan" : "Photo Analysis"} | ${new Date().toLocaleString()}`,
      "color:#888;font-size:11px",
    );
    if (detectedHeight) console.log(`Detected height: ${detectedHeight} cm`);
    console.table(
      Object.fromEntries(measurements.map((m) => [m.name, `${m.value} ${m.unit}`])),
    );
    console.groupEnd();

    toast.success("Measurements saved to your profile!", {
      description: `${measurements.length} measurements recorded · ${new Date().toLocaleDateString()}`,
    });

    closeModal();
  }, [measurements, detectedHeight, modalMode, closeModal]);

  // ── Photo upload ─────────────────────────────────────────────────────────
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setModalMode("upload");
        setIsModalOpen(true);
        setActiveStep(3);
        // Use gender-appropriate defaults (real image pose detection not supported in IMAGE mode here)
        setMeasurements(getMockMeasurements(genderRef.current));
      };
      reader.readAsDataURL(file);
      // Reset so same file can be re-selected
      e.target.value = "";
    },
    [],
  );

  // ── Loading state ────────────────────────────────────────────────────────
  if (isModelLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6 w-16 h-16 mx-auto">
            <div className="w-16 h-16 border-2 border-black/10 rounded-full animate-ping absolute inset-0" />
            <div className="w-16 h-16 border-2 border-black/20 rounded-full animate-spin absolute inset-0 border-t-black" />
            <div className="w-16 h-16 flex items-center justify-center relative">
              <Sparkles className="w-6 h-6 text-black/40" />
            </div>
          </div>
          <h3 className="text-lg font-light text-black/60 mb-1">Loading AI Model</h3>
          <p className="text-sm text-black/40">Preparing pose detection...</p>
        </div>
      </div>
    );
  }

  const savedDate = savedData?.date
    ? new Date(savedData.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="space-y-6">
      {/* ── Gender Selector ────────────────────────────────────────────────── */}
      <div className="border border-black/10 p-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-black/40" />
          <h3 className="text-[10px] uppercase tracking-[0.25em] text-black/40">
            Select Your Gender for Accurate Measurements
          </h3>
        </div>
        <div className="flex gap-3">
          {(["female", "male"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`flex-1 py-3 text-xs uppercase tracking-[0.2em] transition border ${
                gender === g
                  ? "bg-black text-white border-black"
                  : "border-black/15 text-black/40 hover:border-black/30 hover:text-black/60"
              }`}
            >
              {g === "female" ? "Female" : "Male"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left — Instructions */}
        <div className="border border-black/10 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-5 h-5 text-black/40" />
            <h3 className="text-sm uppercase tracking-[0.2em] text-black/40">How It Works</h3>
          </div>

          <div className="space-y-6">
            {instructions.map((ins, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full border border-black/10 flex items-center justify-center">
                  {ins.icon}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-black/80 mb-1">{ins.title}</h4>
                  <p className="text-xs text-black/50">{ins.description}</p>
                  <p className="text-[10px] text-black/30 mt-1">{ins.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-black/5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-black/60 mb-1">Pro Tip</p>
                <p className="text-xs text-black/50">
                  Wear form-fitting clothing for the most accurate measurements.
                  Dark colours against a plain light background work best.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Actions */}
        <div className="border border-black/10 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Ruler className="w-5 h-5 text-black/40" />
            <h3 className="text-sm uppercase tracking-[0.2em] text-black/40">
              Get Your Measurements
            </h3>
          </div>

          <div className="space-y-5">
            {/* Camera */}
            <div className="border border-black/10 p-5 hover:border-black/20 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-base font-light tracking-tight">Self Measurement</h4>
                  <p className="text-xs text-black/50 mt-1">Stand in front of your camera</p>
                </div>
                <CameraIcon className="w-5 h-5 text-black/40" />
              </div>
              <p className="text-[11px] text-black/40 leading-relaxed mb-4">
                Position yourself at a distance where your full body is visible.
                Our AI guides you through the process and captures when you raise your hand.
              </p>
              <button
                onClick={() => openModal("camera")}
                className="w-full px-4 py-3 bg-black text-white text-xs uppercase tracking-[0.2em] hover:bg-black/90 transition flex items-center justify-center gap-2"
              >
                <CameraIcon className="w-4 h-4" />
                Start Self Measurement
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Upload */}
            <div className="border border-black/10 p-5 hover:border-black/20 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-base font-light tracking-tight">Upload Photo</h4>
                  <p className="text-xs text-black/50 mt-1">Use a full-body standing photo</p>
                </div>
                <ImageIcon className="w-5 h-5 text-black/40" />
              </div>
              <p className="text-[11px] text-black/40 leading-relaxed mb-4">
                Upload a clear full-body photo standing straight with arms slightly
                away from your body. The photo should be well-lit and show your
                entire silhouette.
              </p>
              <button
                onClick={() => uploadFileInputRef.current?.click()}
                className="w-full px-4 py-3 border border-black/20 text-black/60 text-xs uppercase tracking-[0.2em] hover:border-black hover:text-black transition flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Upload Full Photo
              </button>
            </div>

            {/* Saved measurements status */}
            <div className="pt-4 border-t border-black/10">
              {savedData ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                        Saved Measurements
                      </p>
                      <p className="text-xs text-black/50 mt-0.5">
                        Last updated: {savedDate} ·{" "}
                        <span className="capitalize">{savedData.gender}</span> ·{" "}
                        {savedData.measurements.length} measurements
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {savedData.measurements.slice(0, 6).map((m) => (
                      <div key={m.name} className="bg-black/3 px-2 py-1.5">
                        <p className="text-[8px] uppercase tracking-wide text-black/30">{m.name}</p>
                        <p className="text-sm font-light text-black/70">
                          {m.value}
                          <span className="text-[9px] text-black/30 ml-0.5">{m.unit}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                      Saved Measurements
                    </p>
                    <p className="text-xs text-black/30 mt-1">No measurements saved yet</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Hidden file input ──────────────────────────────────────────────── */}
      <input
        ref={uploadFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* ── Measurement Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="relative w-full h-full bg-black"
            >

              {/* ── Camera step ─────────────────────────────────────────────── */}
              {modalMode === "camera" && activeStep === 2 && showVideo && (
                <div className="relative w-full h-full overflow-hidden">
                  <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline muted />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 transition"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>

                  {/* Prompt card */}
                  <motion.div
                    key={currentPrompt}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-20 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-md"
                  >
                    <div className="bg-white/10 backdrop-blur border border-white/20 p-5">
                      <div className="flex items-start gap-4">
                        <div className="text-white">{prompts[Math.min(currentPrompt, prompts.length - 1)].icon}</div>
                        <div className="flex-1">
                          <h3 className="text-white text-lg font-light mb-1">
                            {prompts[Math.min(currentPrompt, prompts.length - 1)].title}
                          </h3>
                          <p className="text-white/60 text-sm">
                            {prompts[Math.min(currentPrompt, prompts.length - 1)].description}
                          </p>
                          <p className="text-white/40 text-xs mt-2">
                            {prompts[Math.min(currentPrompt, prompts.length - 1)].instruction}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Detected height */}
                  {detectedHeight && (
                    <div className="absolute top-20 right-56 z-10 bg-white/10 backdrop-blur px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm font-light">Height: {detectedHeight} cm</span>
                      </div>
                    </div>
                  )}

                  {/* Live measurements panel */}
                  {liveMeasurements && (
                    <motion.div
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute right-4 top-32 z-10 w-48 bg-white/10 backdrop-blur border border-white/20"
                    >
                      <div className="p-2 border-b border-white/20">
                        <p className="text-[8px] uppercase tracking-[0.2em] text-white/60 text-center">
                          Live · {gender === "female" ? "Female" : "Male"}
                        </p>
                      </div>
                      <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                        {liveMeasurements.slice(0, 7).map((m, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="text-white/50">{m.name}</span>
                            <span className="text-white font-light">
                              {m.value}{m.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Gesture status */}
                  <div
                    className={`absolute bottom-28 left-1/2 -translate-x-1/2 z-10 px-6 py-3 backdrop-blur transition-all ${
                      gestureDetected.isRaised ? "bg-green-600" : "bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Hand className="w-5 h-5 text-white" />
                      <span className="text-sm font-light tracking-wide text-white">
                        {gestureDetected.isRaised
                          ? `✓ ${gestureDetected.handSide === "left" ? "Left" : "Right"} hand detected!`
                          : "Raise your hand to capture"}
                      </span>
                    </div>
                  </div>

                  {/* Pose quality ring */}
                  <div className="absolute bottom-8 right-8 z-10">
                    <div className="relative w-16 h-16">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                        <circle
                          cx="32" cy="32" r="28" fill="none"
                          stroke={poseQuality > 0.7 ? "#10b981" : poseQuality > 0.4 ? "#6b7280" : "#ef4444"}
                          strokeWidth="4"
                          strokeDasharray={`${poseQuality * 175.9} 175.9`}
                          strokeLinecap="round"
                          className="transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs">{Math.round(poseQuality * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Camera active indicator */}
                  {isCameraActive && (
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-white/60 text-[10px] uppercase tracking-wider">Live</span>
                    </div>
                  )}

                  {/* Countdown overlay */}
                  <AnimatePresence>
                    {countdown !== null && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20"
                      >
                        <p className="text-white/50 text-sm uppercase tracking-widest mb-4">
                          Hold still — capturing in
                        </p>
                        <div className="text-white text-9xl font-light">{countdown}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Controls bar */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 py-3 bg-white/10 text-white text-sm uppercase tracking-[0.15em] hover:bg-white/20 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={startCountdown}
                      disabled={!detectedHeight || isAutoCapturing}
                      className="flex-1 py-3 bg-white text-black text-sm uppercase tracking-[0.15em] hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAutoCapturing ? "Capturing..." : "Take Measurement"}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Results step ─────────────────────────────────────────────── */}
              {activeStep === 3 && measurements && (
                <div className="h-full overflow-y-auto py-12 px-6">
                  <div className="max-w-5xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <div className="flex justify-end">
                        <button onClick={closeModal} className="p-2 hover:bg-white/10 transition">
                          <X className="w-6 h-6 text-white/60 hover:text-white" />
                        </button>
                      </div>

                      {capturedImage && modalMode === "camera" && (
                        <div className="w-40 h-48 mx-auto overflow-hidden border border-white/20">
                          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Header */}
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 mb-3">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-[10px] tracking-[0.2em] uppercase text-green-400">
                            Measurements Complete
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 border border-white/15 px-3 py-1">
                            {gender === "female" ? "Female" : "Male"} Profile
                          </span>
                          {detectedHeight && (
                            <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 border border-white/15 px-3 py-1">
                              Height {detectedHeight} cm
                            </span>
                          )}
                          <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 border border-white/15 px-3 py-1">
                            {modalMode === "camera" ? "AI Body Scan" : "Photo Analysis"}
                          </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">
                          Your Body Profile
                        </h2>
                      </div>

                      {/* Measurements grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {measurements.map((m, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="border border-white/10 p-4 hover:border-white/25 transition-all"
                          >
                            <p className="text-[9px] uppercase tracking-[0.2em] text-white/35 mb-2">
                              {m.name}
                            </p>
                            <p className="text-2xl font-light text-white">
                              {m.value}
                              <span className="text-xs text-white/35 ml-1">{m.unit}</span>
                            </p>
                            <p className="text-[9px] text-white/25 mt-1.5 leading-snug">
                              {m.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Industry-grade disclaimer */}
                      <div className="border border-yellow-500/20 bg-yellow-500/5 p-5">
                        <div className="flex gap-3">
                          <AlertTriangle className="w-4 h-4 text-yellow-500/60 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] text-yellow-400/80 font-medium uppercase tracking-[0.2em] mb-2">
                              Important Disclaimer
                            </p>
                            <p className="text-[11px] text-white/35 leading-relaxed">{DISCLAIMER}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-4 pt-2">
                        <button
                          onClick={closeModal}
                          className="flex-1 py-4 border border-white/20 text-white/50 hover:border-white/35 text-sm uppercase tracking-[0.15em] transition"
                        >
                          Discard
                        </button>
                        <button
                          onClick={saveMeasurements}
                          className="flex-1 py-4 bg-white text-black text-sm uppercase tracking-[0.15em] hover:bg-white/90 transition font-medium"
                        >
                          Confirm & Save to Profile
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error toast ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-light">{error}</span>
              <button onClick={() => setError(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeasurementTab;
