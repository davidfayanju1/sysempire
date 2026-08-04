// components/measurement/BodyScanCapture.tsx
//
// Shared guided camera capture used by both the Personal Fit order flow and the
// Profile "Take Measurement" tab. Captures a front photo (for width) and a side
// photo (for depth), then combines both into real circumference measurements
// instead of guessing them from a single view.
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Hand,
  Ruler,
  CheckCircle2,
  AlertTriangle,
  User,
  RotateCw,
  SkipForward,
} from "lucide-react";
import { PoseLandmarker, ImageSegmenter, FilesetResolver } from "@mediapipe/tasks-vision";
import {
  LANDMARKS,
  DISCLAIMER,
  detectRaisedHand,
  calculatePoseQuality,
  calculateHeightFromLandmarks,
  checkFraming,
  computeFrontGeometry,
  computeSideDepths,
  buildMeasurements,
  type Measurement,
  type PoseLandmark,
  type FrontGeometry,
  type SideDepths,
  type FramingState,
} from "../../lib/bodyMeasurement";

interface BodyScanCaptureProps {
  onClose: () => void;
  onComplete: (measurements: Measurement[]) => void;
  gender: "male" | "female" | null;
}

type Phase = "front" | "side-prompt" | "side" | "processing" | "results";

const SEGMENTER_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/deeplab_v3/float32/1/deeplab_v3.tflite";
const PERSON_CATEGORY_INDEX = 15; // Pascal VOC class used by deeplab_v3

function drawStandingGuide(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  goodPose: boolean,
): void {
  const cx = w / 2;
  const color = goodPose ? "rgba(16,185,129,0.55)" : "rgba(255,255,255,0.28)";
  const zoneW = Math.min(w * 0.38, 280);
  const zoneH = h * 0.9;
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

const BodyScanCapture = ({ onClose, onComplete, gender }: BodyScanCaptureProps) => {
  const effectiveGender: "male" | "female" = gender ?? "female";

  const [phase, setPhase] = useState<Phase>("front");
  const [measurements, setMeasurements] = useState<Measurement[] | null>(null);
  const [gestureDetected, setGestureDetected] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [detectedHeight, setDetectedHeight] = useState<number | null>(null);
  const [poseQuality, setPoseQuality] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [usedSideScan, setUsedSideScan] = useState(false);
  const [framing, setFraming] = useState<FramingState>({
    headVisible: false,
    feetVisible: false,
    isFullyFramed: false,
  });
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [sidePhoto, setSidePhoto] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const visionRef = useRef<Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>> | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const imageSegmenterRef = useRef<ImageSegmenter | null>(null);
  const animationRef = useRef<number | null>(null);
  const countdownActiveRef = useRef(false);

  const detectedHeightRef = useRef<number | null>(null);
  const frontGeometryRef = useRef<FrontGeometry | null>(null);
  const latestLandmarksRef = useRef<PoseLandmark[] | null>(null);
  const latestWorldLandmarksRef = useRef<PoseLandmark[] | null>(null);
  const lastGestureRef = useRef(false);
  const lastQualityBandRef = useRef(-1);
  const lastFramingKeyRef = useRef("");
  const onCaptureRef = useRef<
    ((landmarks: PoseLandmark[], worldLandmarks: PoseLandmark[]) => void) | null
  >(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setCameraReady(false);
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
            const lms = latestLandmarksRef.current;
            const wlms = latestWorldLandmarksRef.current;
            if (lms && wlms) {
              onCaptureRef.current?.(lms, wlms);
            }
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const startRealTimeDetection = useCallback((poseLandmarker: PoseLandmarker) => {
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
          const res = poseLandmarker.detectForVideo(video, ts);
          if (res.landmarks?.length > 0) {
            const lms = res.landmarks[0];
            const wlms = res.worldLandmarks?.[0];

            const gesture = detectRaisedHand(lms);
            const quality = calculatePoseQuality(lms);
            const frame = checkFraming(lms);

            if (gesture.isRaised !== lastGestureRef.current) {
              lastGestureRef.current = gesture.isRaised;
              setGestureDetected(gesture.isRaised);
            }
            const qBand = quality > 0.7 ? 2 : quality > 0.4 ? 1 : 0;
            if (qBand !== lastQualityBandRef.current) {
              lastQualityBandRef.current = qBand;
              setPoseQuality(quality);
            }
            const framingKey = `${frame.headVisible}-${frame.feetVisible}`;
            if (framingKey !== lastFramingKeyRef.current) {
              lastFramingKeyRef.current = framingKey;
              setFraming(frame);
            }

            drawStandingGuide(ctx, canvas.width, canvas.height, quality > 0.6);

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
              if (s && e && (s.visibility ?? 0) > 0.3 && (e.visibility ?? 0) > 0.3) {
                ctx.beginPath();
                ctx.moveTo(s.x * canvas.width, s.y * canvas.height);
                ctx.lineTo(e.x * canvas.width, e.y * canvas.height);
                ctx.strokeStyle = gesture.isRaised ? "#10b981" : "#6b7280";
                ctx.lineWidth = 3;
                ctx.stroke();
              }
            });
            lms.forEach((lm) => {
              if ((lm.visibility ?? 0) > 0.3) {
                ctx.beginPath();
                ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 5, 0, 2 * Math.PI);
                ctx.fillStyle = gesture.isRaised ? "#10b981" : "#ffffff";
                ctx.fill();
              }
            });

            if (wlms && quality > 0.5) {
              latestLandmarksRef.current = lms;
              latestWorldLandmarksRef.current = wlms;
              const h = calculateHeightFromLandmarks(wlms);
              if (h && h !== detectedHeightRef.current) {
                detectedHeightRef.current = h;
                setDetectedHeight(h);
              }
              if (
                gesture.isRaised &&
                !countdownActiveRef.current &&
                quality > 0.6 &&
                frame.isFullyFramed
              ) {
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
  }, [triggerCapture]);

  const startCamera = useCallback(async () => {
    try {
      if (!visionRef.current) {
        visionRef.current = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
        );
      }
      if (!poseLandmarkerRef.current) {
        poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(visionRef.current, {
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
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.() as
        | (MediaTrackCapabilities & { zoom?: { min?: number } })
        | undefined;
      if (capabilities?.zoom?.min !== undefined) {
        track
          .applyConstraints({
            advanced: [{ zoom: capabilities.zoom.min }],
          } as unknown as MediaTrackConstraints)
          .catch(() => {});
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraReady(true);
          if (poseLandmarkerRef.current) startRealTimeDetection(poseLandmarkerRef.current);
        };
      }
    } catch (err) {
      console.error("Camera/model init error:", err);
    }
  }, [startRealTimeDetection]);

  const getOrCreateSegmenter = useCallback(async () => {
    if (imageSegmenterRef.current) return imageSegmenterRef.current;
    if (!visionRef.current) {
      visionRef.current = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
      );
    }
    const segmenter = await ImageSegmenter.createFromOptions(visionRef.current, {
      baseOptions: { modelAssetPath: SEGMENTER_MODEL_URL, delegate: "GPU" },
      runningMode: "IMAGE",
      outputCategoryMask: true,
      outputConfidenceMasks: false,
    });
    imageSegmenterRef.current = segmenter;
    return segmenter;
  }, []);

  const finalizeMeasurements = useCallback(
    (sideDepths: SideDepths | null) => {
      const geometry = frontGeometryRef.current;
      if (!geometry) return;
      const result = buildMeasurements(geometry, sideDepths, effectiveGender);
      setMeasurements(result);
      setUsedSideScan(!!sideDepths);
      setPhase("results");
    },
    [effectiveGender],
  );

  const handleFrontCaptured = useCallback(
    (_lms: PoseLandmark[], wlms: PoseLandmark[]) => {
      const h = calculateHeightFromLandmarks(wlms) ?? detectedHeightRef.current ?? 170;
      frontGeometryRef.current = computeFrontGeometry(wlms, h);
      detectedHeightRef.current = h;
      setDetectedHeight(h);
      setFrontPhoto(canvasRef.current?.toDataURL("image/jpeg", 0.9) ?? null);
      stopCamera();
      setPhase("side-prompt");
    },
    [stopCamera],
  );

  const handleSideCaptured = useCallback(
    async (lms: PoseLandmark[]) => {
      const canvas = canvasRef.current;
      setSidePhoto(canvas?.toDataURL("image/jpeg", 0.9) ?? null);
      stopCamera();
      setPhase("processing");
      try {
        const segmenter = await getOrCreateSegmenter();
        const result = canvas ? segmenter.segment(canvas) : null;
        const categoryMask = result?.categoryMask;

        if (categoryMask) {
          const maskArr = categoryMask.getAsUint8Array();
          const ls = lms[LANDMARKS.LEFT_SHOULDER];
          const rs = lms[LANDMARKS.RIGHT_SHOULDER];
          const lh = lms[LANDMARKS.LEFT_HIP];
          const rh = lms[LANDMARKS.RIGHT_HIP];
          const lHeel = lms[LANDMARKS.LEFT_HEEL];
          const rHeel = lms[LANDMARKS.RIGHT_HEEL];
          const nose = lms[LANDMARKS.NOSE];

          const depths = computeSideDepths({
            mask: maskArr,
            maskWidth: categoryMask.width,
            maskHeight: categoryMask.height,
            isForeground: (v) => v === PERSON_CATEGORY_INDEX,
            noseY: nose?.y ?? 0,
            shoulderY: ((ls?.y ?? 0) + (rs?.y ?? 0)) / 2,
            hipY: ((lh?.y ?? 0) + (rh?.y ?? 0)) / 2,
            heelY: Math.max(lHeel?.y ?? 0, rHeel?.y ?? 0),
            heightCm: detectedHeightRef.current ?? 170,
          });
          finalizeMeasurements(depths);
          return;
        }
        finalizeMeasurements(null);
      } catch (err) {
        console.error("Side scan failed, using front-only estimate:", err);
        finalizeMeasurements(null);
      }
    },
    [stopCamera, getOrCreateSegmenter, finalizeMeasurements],
  );

  const startSidePhase = useCallback(() => {
    onCaptureRef.current = handleSideCaptured;
    setPhase("side");
  }, [handleSideCaptured]);

  const skipSidePhase = useCallback(() => {
    finalizeMeasurements(null);
  }, [finalizeMeasurements]);

  useEffect(() => {
    onCaptureRef.current = handleFrontCaptured;
    startCamera();
    return () => {
      stopCamera();
      poseLandmarkerRef.current?.close();
      imageSegmenterRef.current?.close();
    };
    // Mount-only: starts the first (front) capture session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === "side") {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleSave = useCallback(() => {
    if (!measurements) return;
    onComplete(measurements);
    onClose();
  }, [measurements, onComplete, onClose]);

  const isCameraPhase = phase === "front" || phase === "side";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={(e) => e.target === e.currentTarget && phase !== "processing" && onClose()}
      >
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          className="relative w-full h-full bg-black"
        >
          {/* ── Camera phases (front / side) ─────────────────────────────── */}
          {isCameraPhase && (
            <>
              <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline muted />
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>

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
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 backdrop-blur">
                  <span className="text-white/60 text-[10px] uppercase tracking-wider">
                    Step {phase === "front" ? "1" : "2"} of 2 · {phase === "front" ? "Front" : "Side"}
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

              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/40 text-sm">Initialising camera…</div>
                </div>
              )}

              {cameraReady && (
                <div className="absolute bottom-48 left-1/2 -translate-x-1/2 z-10 w-[92%] max-w-sm">
                  <div className="bg-black/70 backdrop-blur px-5 py-3 text-center space-y-1">
                    <p className="text-white/85 text-[11px] leading-relaxed tracking-wide">
                      {phase === "front" ? (
                        <>
                          Step back until your{" "}
                          <span className="text-white font-medium">full body — head to toe</span>{" "}
                          fits inside the dashed outline, facing the camera
                        </>
                      ) : (
                        <>
                          Now turn <span className="text-white font-medium">90° sideways</span> —
                          right shoulder toward the camera — keeping your full body in the outline
                        </>
                      )}
                    </p>
                    <p className="text-white/40 text-[10px] tracking-widest uppercase">
                      Recommended distance · 2–2.5 m (6–8 ft) from camera
                    </p>
                  </div>
                </div>
              )}

              <div
                className={`absolute bottom-28 left-1/2 -translate-x-1/2 z-10 px-6 py-3 backdrop-blur transition-all ${
                  !framing.isFullyFramed
                    ? "bg-amber-600"
                    : gestureDetected
                      ? "bg-green-600"
                      : "bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  {!framing.isFullyFramed ? (
                    <AlertTriangle className="w-5 h-5 text-white" />
                  ) : (
                    <Hand className="w-5 h-5 text-white" />
                  )}
                  <span className="text-sm font-light tracking-wide text-white">
                    {!framing.headVisible && !framing.feetVisible
                      ? "Step back — we can't see your head or feet"
                      : !framing.headVisible
                        ? "Step back or adjust the camera — we can't see your head"
                        : !framing.feetVisible
                          ? "Step back — we can't see your feet"
                          : gestureDetected
                            ? "✓ Hand detected — hold perfectly still…"
                            : "Raise either hand above shoulder level to capture"}
                  </span>
                </div>
              </div>

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

              <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-white/10 text-white text-sm uppercase tracking-[0.15em] hover:bg-white/20 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={triggerCapture}
                  disabled={!cameraReady || countdown !== null || !framing.isFullyFramed}
                  className="flex-1 py-3 bg-white text-black text-sm uppercase tracking-[0.15em] hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Capture Now
                </button>
              </div>

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

          {/* ── Side-scan prompt ──────────────────────────────────────────── */}
          {phase === "side-prompt" && (
            <div className="h-full flex items-center justify-center px-6">
              <div className="max-w-md w-full text-center">
                {frontPhoto ? (
                  <img
                    src={frontPhoto}
                    alt="Captured front photo"
                    className="w-28 h-36 object-cover mx-auto mb-6 border border-white/20"
                  />
                ) : (
                  <div className="w-14 h-14 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                )}
                <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
                  Front captured
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-8">
                  For accurate bust, waist and hip measurements, we need one more
                  photo from your side — this lets us measure your body's depth,
                  not just its width. Turn 90° so your side faces the camera.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={startSidePhase}
                    className="w-full py-3 bg-white text-black text-sm uppercase tracking-[0.15em] hover:bg-white/90 transition flex items-center justify-center gap-2"
                  >
                    <RotateCw className="w-4 h-4" />
                    Continue — Scan My Side
                  </button>
                  <button
                    onClick={skipSidePhase}
                    className="w-full py-3 bg-white/10 text-white/70 text-sm uppercase tracking-[0.15em] hover:bg-white/20 transition flex items-center justify-center gap-2"
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip — Use Estimate Instead
                  </button>
                </div>
                <p className="text-white/30 text-[10px] mt-6 leading-relaxed">
                  Skipping still gives you a full set of measurements, just with a
                  wider accuracy margin on Bust/Chest, Waist and Hips.
                </p>
              </div>
            </div>
          )}

          {/* ── Processing ────────────────────────────────────────────────── */}
          {phase === "processing" && (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-white/50 text-sm tracking-wide">
                Combining your front and side scans…
              </p>
            </div>
          )}

          {/* ── Results ───────────────────────────────────────────────────── */}
          {phase === "results" && measurements && (
            <div className="h-full overflow-y-auto py-12 px-6">
              <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex justify-end">
                  <button onClick={onClose} className="p-2 hover:bg-white/10 transition">
                    <X className="w-6 h-6 text-white/60 hover:text-white" />
                  </button>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-[10px] tracking-[0.2em] uppercase text-green-400">
                      Measurements Complete
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3 mb-2 flex-wrap">
                    <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 border border-white/15 px-3 py-1">
                      {effectiveGender} Profile
                    </span>
                    {detectedHeight && (
                      <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 border border-white/15 px-3 py-1">
                        Height {detectedHeight} cm
                      </span>
                    )}
                    <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 border border-white/15 px-3 py-1">
                      {usedSideScan ? "Front + Side Scan" : "Front Scan Only"}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">
                    Your Body Profile
                  </h2>
                  {!usedSideScan && (
                    <p className="text-amber-400/80 text-xs mt-4 max-w-md mx-auto leading-relaxed">
                      Bust/Chest, Waist and Hips are estimated from your front photo
                      only — for tighter accuracy, redo this scan and include the
                      side photo.
                    </p>
                  )}
                </div>

                {(frontPhoto || sidePhoto) && (
                  <div className="flex justify-center gap-4">
                    {frontPhoto && (
                      <div className="text-center">
                        <img
                          src={frontPhoto}
                          alt="Captured front photo"
                          className="w-24 h-32 sm:w-28 sm:h-36 object-cover border border-white/15"
                        />
                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mt-2">
                          Front
                        </p>
                      </div>
                    )}
                    {sidePhoto && (
                      <div className="text-center">
                        <img
                          src={sidePhoto}
                          alt="Captured side photo"
                          className="w-24 h-32 sm:w-28 sm:h-36 object-cover border border-white/15"
                        />
                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mt-2">
                          Side
                        </p>
                      </div>
                    )}
                  </div>
                )}

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
                        <span className="text-sm text-white/40 ml-1">{m.unit}</span>
                      </p>
                      <p className="text-[10px] text-white/30 mt-2 leading-relaxed">
                        {m.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 p-4">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-200/70 leading-relaxed">{DISCLAIMER}</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      frontGeometryRef.current = null;
                      setMeasurements(null);
                      setDetectedHeight(null);
                      setFrontPhoto(null);
                      setSidePhoto(null);
                      onCaptureRef.current = handleFrontCaptured;
                      setPhase("front");
                    }}
                    className="flex-1 py-3 bg-white/10 text-white text-sm uppercase tracking-[0.15em] hover:bg-white/20 transition"
                  >
                    Redo Scan
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 bg-white text-black text-sm uppercase tracking-[0.15em] hover:bg-white/90 transition"
                  >
                    Use These Measurements
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

export default BodyScanCapture;
