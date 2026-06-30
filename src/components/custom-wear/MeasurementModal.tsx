import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Hand, Ruler, CheckCircle2, AlertTriangle, User } from "lucide-react";
import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

interface MeasurementModalProps {
  onClose: () => void;
  onComplete: (measurements: Measurement[]) => void;
  gender: "male" | "female" | null;
}

interface Measurement {
  name: string;
  value: number;
  unit: string;
  description: string;
}

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

const DISCLAIMER =
  "These measurements are AI-generated estimates derived from computer vision analysis. Expected accuracy: ±2–5 cm depending on camera angle, distance, clothing, body position, and lighting. These measurements are a tailoring guide only — not a substitute for professional measurements. For precision garments, verify with an experienced tailor before fabric is cut. SYS EMPIRE accepts no liability for fit discrepancies based solely on AI-estimated measurements.";

function drawStandingGuide(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  goodPose: boolean,
): void {
  const cx = w / 2;
  const color = goodPose ? "rgba(16,185,129,0.55)" : "rgba(255,255,255,0.28)";
  const zoneW = Math.min(w * 0.38, 280);
  const zoneH = h * 0.90;
  const zoneX = cx - zoneW / 2;
  const zoneY = h * 0.05;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 5]);
  ctx.strokeRect(zoneX, zoneY, zoneW, zoneH);

  const headR = zoneW * 0.12;
  const headCY = zoneY + headR * 1.8;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.arc(cx, headCY, headR, 0, Math.PI * 2);
  ctx.stroke();

  const shoulderY = headCY + headR + 4;
  const hipY = zoneY + zoneH * 0.58;
  const kneeY = zoneY + zoneH * 0.77;
  const footY = zoneY + zoneH - 8;
  const shoulderW = zoneW * 0.36;
  const hipW = zoneW * 0.26;

  ctx.beginPath();
  ctx.moveTo(cx, shoulderY);
  ctx.lineTo(cx, hipY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - shoulderW, shoulderY + 4);
  ctx.lineTo(cx + shoulderW, shoulderY + 4);
  ctx.stroke();

  const armBottomY = hipY - 20;
  ctx.beginPath();
  ctx.moveTo(cx - shoulderW, shoulderY + 4);
  ctx.lineTo(cx - shoulderW * 0.9, armBottomY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + shoulderW, shoulderY + 4);
  ctx.lineTo(cx + shoulderW * 0.9, armBottomY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - hipW, hipY);
  ctx.lineTo(cx + hipW, hipY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - hipW * 0.7, hipY);
  ctx.lineTo(cx - hipW * 0.55, kneeY);
  ctx.lineTo(cx - hipW * 0.5, footY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + hipW * 0.7, hipY);
  ctx.lineTo(cx + hipW * 0.55, kneeY);
  ctx.lineTo(cx + hipW * 0.5, footY);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.restore();
}

// Gender-aware calculation — same formulas as MeasurementTab
function buildMeasurements(
  worldLandmarks: any[],
  heightCm: number,
  gender: "male" | "female",
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

  const sw = Math.abs((ls?.x || 0) - (rs?.x || 0)) * 100;   // shoulder width
  const hw = Math.abs((lh?.x || 0) - (rh?.x || 0)) * 100;   // hip width
  const tl = Math.abs((ls?.y || 0) - (lh?.y || 0)) * 100;   // torso length
  const leftArm = Math.abs((ls?.y || 0) - (lw?.y || 0)) * 100;
  const rightArm = Math.abs((rs?.y || 0) - (rw?.y || 0)) * 100;
  const avgArm = (leftArm + rightArm) / 2;
  const leftLeg = Math.abs((lh?.y || 0) - (la?.y || 0)) * 100;
  const rightLeg = Math.abs((rh?.y || 0) - (ra?.y || 0)) * 100;
  const avgLeg = (leftLeg + rightLeg) / 2;

  const sf = heightCm / 170;

  if (gender === "female") {
    return [
      { name: "Height", value: heightCm, unit: "cm", description: "Total standing height" },
      { name: "Shoulder Width", value: Math.round(sw * sf), unit: "cm", description: "Shoulder point to shoulder point (back)" },
      { name: "Bust", value: Math.round(sw * 2.5 * sf), unit: "cm", description: "Fullest part of chest — at nipple line" },
      { name: "Under Bust", value: Math.round(sw * 2.1 * sf), unit: "cm", description: "Directly below bust" },
      { name: "Waist", value: Math.round(hw * 2.0 * sf), unit: "cm", description: "Narrowest part of natural waist" },
      { name: "Hips", value: Math.round(hw * 2.8 * sf), unit: "cm", description: "Fullest part of hips and seat" },
      { name: "Neck", value: Math.round(sw * 0.58 * sf), unit: "cm", description: "Around the base of neck" },
      { name: "Arm Length", value: Math.round(avgArm * sf), unit: "cm", description: "Shoulder point to wrist bone" },
      { name: "Wrist", value: Math.round(avgArm * 0.11 * sf), unit: "cm", description: "Around the wrist bone" },
      { name: "Thigh", value: Math.round(avgLeg * 0.32 * sf), unit: "cm", description: "Fullest part of upper thigh" },
      { name: "Calf", value: Math.round(avgLeg * 0.20 * sf), unit: "cm", description: "Fullest part of calf" },
      { name: "Dress Length", value: Math.round((tl + avgLeg * 0.85) * sf), unit: "cm", description: "Shoulder to floor (full-length garment)" },
    ];
  }

  // Male
  return [
    { name: "Height", value: heightCm, unit: "cm", description: "Total standing height" },
    { name: "Shoulder Width", value: Math.round(sw * sf), unit: "cm", description: "Shoulder point to shoulder point (back)" },
    { name: "Chest", value: Math.round(sw * 2.45 * sf), unit: "cm", description: "Fullest part of chest — across shoulder blades" },
    { name: "Waist", value: Math.round(hw * 2.3 * sf), unit: "cm", description: "Narrowest part of natural waist" },
    { name: "Hips", value: Math.round(hw * 2.6 * sf), unit: "cm", description: "Fullest part of the seat" },
    { name: "Neck", value: Math.round(sw * 0.67 * sf), unit: "cm", description: "Around base of neck + 1 cm ease" },
    { name: "Sleeve Length", value: Math.round(avgArm * sf), unit: "cm", description: "Shoulder point to wrist (arm slightly bent)" },
    { name: "Wrist", value: Math.round(avgArm * 0.13 * sf), unit: "cm", description: "Around the wrist bone" },
    { name: "Thigh", value: Math.round(avgLeg * 0.28 * sf), unit: "cm", description: "Fullest part of upper thigh" },
    { name: "Inseam", value: Math.round(avgLeg * sf), unit: "cm", description: "Crotch to ankle (inner leg)" },
    { name: "Jacket Length", value: Math.round(tl * 1.75 * sf), unit: "cm", description: "Natural waist to hem (suit / agbada)" },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
const MeasurementModal = ({ onClose, onComplete, gender }: MeasurementModalProps) => {
  const effectiveGender: "male" | "female" = gender ?? "female";

  const [step, setStep] = useState<"camera" | "results">("camera");
  const [measurements, setMeasurements] = useState<Measurement[] | null>(null);
  const [gestureDetected, setGestureDetected] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [detectedHeight, setDetectedHeight] = useState<number | null>(null);
  const [poseQuality, setPoseQuality] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const poseLandmarkerRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const countdownActiveRef = useRef(false);

  // Refs to avoid stale closure issues inside animation loop / interval
  const detectedHeightRef = useRef<number | null>(null);
  const latestWorldLandmarksRef = useRef<any[] | null>(null);
  const lastGestureRef = useRef(false);
  const lastQualityBandRef = useRef(-1);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  }, []);

  const calculateHeightFromLandmarks = useCallback((wl: any[]): number | null => {
    if (!wl || wl.length < 32) return null;
    const nose = wl[LANDMARKS.NOSE];
    const lHeel = wl[LANDMARKS.LEFT_HEEL];
    const rHeel = wl[LANDMARKS.RIGHT_HEEL];
    const lFoot = wl[LANDMARKS.LEFT_FOOT_INDEX];
    const rFoot = wl[LANDMARKS.RIGHT_FOOT_INDEX];
    if (!nose || !lHeel || !rHeel) return null;
    const feetY = Math.max(lHeel.y ?? 0, rHeel.y ?? 0, lFoot?.y ?? 0, rFoot?.y ?? 0);
    const h = Math.abs(feetY - nose.y) * 100 * 1.8;
    return h > 140 && h < 220 ? Math.round(h) : 170;
  }, []);

  const detectRaisedHand = useCallback((lms: any[]): boolean => {
    const lw = lms[LANDMARKS.LEFT_WRIST];
    const rw = lms[LANDMARKS.RIGHT_WRIST];
    const ls = lms[LANDMARKS.LEFT_SHOULDER];
    const rs = lms[LANDMARKS.RIGHT_SHOULDER];
    const leftUp = lw && ls && lw.visibility > 0.5 && lw.y < ls.y;
    const rightUp = rw && rs && rw.visibility > 0.5 && rw.y < rs.y;
    return leftUp || rightUp;
  }, []);

  const calculatePoseQuality = useCallback((lms: any[]): number => {
    const key = [
      LANDMARKS.LEFT_SHOULDER,
      LANDMARKS.RIGHT_SHOULDER,
      LANDMARKS.LEFT_HIP,
      LANDMARKS.RIGHT_HIP,
      LANDMARKS.LEFT_KNEE,
      LANDMARKS.RIGHT_KNEE,
    ];
    return key.filter((i) => lms[i]?.visibility > 0.5).length / key.length;
  }, []);

  const triggerCapture = useCallback(() => {
    if (countdownActiveRef.current) return;
    countdownActiveRef.current = true;
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          countdownActiveRef.current = false;

          if (prev === 1) {
            // Use refs — not stale state — to capture measurements
            const h = detectedHeightRef.current ?? 170;
            const wl = latestWorldLandmarksRef.current;
            if (wl) {
              const result = buildMeasurements(wl, h, effectiveGender);
              setMeasurements(result);
              setStep("results");
              stopCamera();
            }
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [effectiveGender, stopCamera]);

  const startRealTimeDetection = useCallback(
    (poseLandmarker: any) => {
      let lastTs = -1;

      const loop = async (ts: number) => {
        if (!videoRef.current || !canvasRef.current) {
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
            const res = await poseLandmarker.detectForVideo(video, ts);
            if (res.landmarks?.length > 0) {
              const lms = res.landmarks[0];
              const wlms = res.worldLandmarks?.[0];

              const gesture = detectRaisedHand(lms);
              const quality = calculatePoseQuality(lms);

              if (gesture !== lastGestureRef.current) {
                lastGestureRef.current = gesture;
                setGestureDetected(gesture);
              }
              const qBand = quality > 0.7 ? 2 : quality > 0.4 ? 1 : 0;
              if (qBand !== lastQualityBandRef.current) {
                lastQualityBandRef.current = qBand;
                setPoseQuality(quality);
              }

              drawStandingGuide(ctx, canvas.width, canvas.height, quality > 0.6);

              // Draw skeleton
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
              connections.forEach(([a, b]) => {
                const s = lms[a];
                const e = lms[b];
                if (s && e && s.visibility > 0.3 && e.visibility > 0.3) {
                  ctx.beginPath();
                  ctx.moveTo(s.x * canvas.width, s.y * canvas.height);
                  ctx.lineTo(e.x * canvas.width, e.y * canvas.height);
                  ctx.strokeStyle = gesture ? "#10b981" : "#6b7280";
                  ctx.lineWidth = 3;
                  ctx.stroke();
                }
              });
              lms.forEach((lm: any) => {
                if (lm.visibility > 0.3) {
                  ctx.beginPath();
                  ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 5, 0, 2 * Math.PI);
                  ctx.fillStyle = gesture ? "#10b981" : "#ffffff";
                  ctx.fill();
                }
              });

              if (wlms && quality > 0.5) {
                latestWorldLandmarksRef.current = wlms;
                const h = calculateHeightFromLandmarks(wlms);
                if (h && h !== detectedHeightRef.current) {
                  detectedHeightRef.current = h;
                  setDetectedHeight(h);
                }
                if (gesture && !countdownActiveRef.current && quality > 0.6) {
                  triggerCapture();
                }
              }
            }
          } catch {
            /* suppress frame errors */
          }
        }

        animationRef.current = requestAnimationFrame(loop);
      };

      animationRef.current = requestAnimationFrame(loop);
    },
    [detectRaisedHand, calculatePoseQuality, calculateHeightFromLandmarks, triggerCapture],
  );

  const startCamera = useCallback(async () => {
    try {
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

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      // Zoom to widest angle on cameras that support hardware zoom (e.g. phone rear/front)
      const track = stream.getVideoTracks()[0];
      const cap = (track as any).getCapabilities?.();
      if (cap?.zoom?.min !== undefined) {
        track.applyConstraints({ advanced: [{ zoom: cap.zoom.min }] } as unknown as MediaTrackConstraints);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraReady(true);
          startRealTimeDetection(pl);
        };
      }
    } catch (err) {
      console.error("Camera/model init error:", err);
    }
  }, [startRealTimeDetection]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      poseLandmarkerRef.current?.close();
    };
  }, [startCamera, stopCamera]);

  const handleSave = useCallback(() => {
    if (!measurements) return;

    // Console output
    console.group("📏 SYS EMPIRE — Body Measurements (Custom Wear Flow)");
    console.log(
      `%cGender: ${effectiveGender} | Method: AI Body Scan | ${new Date().toLocaleString()}`,
      "color:#888;font-size:11px",
    );
    if (detectedHeight) console.log(`Detected height: ${detectedHeight} cm`);
    console.table(
      Object.fromEntries(measurements.map((m) => [m.name, `${m.value} ${m.unit}`])),
    );
    console.groupEnd();

    onComplete(measurements);
    onClose();
  }, [measurements, effectiveGender, detectedHeight, onComplete, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          className="relative w-full h-full bg-black"
        >
          {/* ── Camera step ───────────────────────────────────────────────── */}
          {step === "camera" && (
            <>
              <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline muted />
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Gender + camera status */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
                {cameraReady && (
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 backdrop-blur">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white/60 text-[10px] uppercase tracking-wider">Live</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 backdrop-blur">
                  <User className="w-3 h-3 text-white/50" />
                  <span className="text-white/60 text-[10px] uppercase tracking-wider">
                    {effectiveGender}
                  </span>
                </div>
              </div>

              {detectedHeight && (
                <div className="absolute top-20 left-4 z-10 bg-white/10 backdrop-blur px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-green-400" />
                    <span className="text-white text-sm">Height: {detectedHeight} cm</span>
                  </div>
                </div>
              )}

              {/* Guide text */}
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/40 text-sm">Initialising camera & AI model…</div>
                </div>
              )}

              {/* Standing distance instruction */}
              {cameraReady && (
                <div className="absolute bottom-48 left-1/2 -translate-x-1/2 z-10 w-[92%] max-w-sm">
                  <div className="bg-black/70 backdrop-blur px-5 py-3 text-center space-y-1">
                    <p className="text-white/85 text-[11px] leading-relaxed tracking-wide">
                      Step back until your <span className="text-white font-medium">full body — head to toe</span> fits inside the dashed outline
                    </p>
                    <p className="text-white/40 text-[10px] tracking-widest uppercase">
                      Recommended distance · 2–2.5 m (6–8 ft) from camera
                    </p>
                  </div>
                </div>
              )}

              <div
                className={`absolute bottom-28 left-1/2 -translate-x-1/2 z-10 px-6 py-3 backdrop-blur transition-all ${
                  gestureDetected ? "bg-green-600" : "bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Hand className="w-5 h-5 text-white" />
                  <span className="text-sm font-light tracking-wide text-white">
                    {gestureDetected
                      ? "✓ Hand detected — hold perfectly still…"
                      : "Raise either hand above shoulder level to capture"}
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white text-xs">{Math.round(poseQuality * 100)}%</span>
                    <span className="text-white/30 text-[7px] uppercase tracking-wider">Pose</span>
                  </div>
                </div>
              </div>

              {/* Manual capture button */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-white/10 text-white text-sm uppercase tracking-[0.15em] hover:bg-white/20 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={triggerCapture}
                  disabled={!cameraReady || countdownActiveRef.current}
                  className="flex-1 py-3 bg-white text-black text-sm uppercase tracking-[0.15em] hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Capture Now
                </button>
              </div>

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
                    <div className="text-white text-8xl font-light">{countdown}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* ── Results step ──────────────────────────────────────────────── */}
          {step === "results" && measurements && (
            <div className="h-full overflow-y-auto py-12 px-6">
              <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex justify-end">
                  <button onClick={onClose} className="p-2 hover:bg-white/10 transition">
                    <X className="w-6 h-6 text-white/60 hover:text-white" />
                  </button>
                </div>

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
                      {effectiveGender} Profile
                    </span>
                    {detectedHeight && (
                      <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 border border-white/15 px-3 py-1">
                        Height {detectedHeight} cm
                      </span>
                    )}
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
                    onClick={onClose}
                    className="flex-1 py-4 border border-white/20 text-white/50 hover:border-white/35 text-sm uppercase tracking-[0.15em] transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-4 bg-white text-black text-sm uppercase tracking-[0.15em] hover:bg-white/90 transition font-medium"
                  >
                    Confirm & Use These Measurements
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MeasurementModal;
