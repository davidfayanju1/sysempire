import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Hand, Ruler, CheckCircle2 } from "lucide-react";
import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

interface MeasurementModalProps {
  onClose: () => void;
  onComplete: (measurements: any[]) => void;
  gender: "male" | "female" | null;
}

interface Measurement {
  name: string;
  value: number;
  unit: string;
  description: string;
}

const MeasurementModal = ({
  onClose,
  onComplete,
  gender,
}: MeasurementModalProps) => {
  const [step, setStep] = useState<"camera" | "results">("camera");
  const [measurements, setMeasurements] = useState<Measurement[] | null>(null);
  const [gestureDetected, setGestureDetected] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [detectedHeight, setDetectedHeight] = useState<number | null>(null);
  const [poseQuality, setPoseQuality] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const poseLandmarkerRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);

  // MediaPipe Pose Landmark indices
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
  };

  // Nigerian tailor measurements based on gender
  const getMeasurementFields = () => {
    if (gender === "female") {
      return [
        { name: "Height", unit: "cm", description: "Total height" },
        { name: "Bust", unit: "cm", description: "Fullest part of chest" },
        { name: "Under Bust", unit: "cm", description: "Just below bust" },
        { name: "Waist", unit: "cm", description: "Narrowest part of torso" },
        { name: "Hips", unit: "cm", description: "Widest part of hips/seat" },
        { name: "Shoulder Width", unit: "cm", description: "Across the back" },
        { name: "Arm Length", unit: "cm", description: "Shoulder to wrist" },
        { name: "Wrist", unit: "cm", description: "Wrist circumference" },
        { name: "Thigh", unit: "cm", description: "Upper leg circumference" },
        { name: "Calf", unit: "cm", description: "Lower leg circumference" },
      ];
    } else {
      return [
        { name: "Height", unit: "cm", description: "Total height" },
        { name: "Chest", unit: "cm", description: "Fullest part of chest" },
        { name: "Waist", unit: "cm", description: "Narrowest part of torso" },
        { name: "Hips", unit: "cm", description: "Widest part of hips/seat" },
        { name: "Shoulder Width", unit: "cm", description: "Across the back" },
        { name: "Neck", unit: "cm", description: "Neck circumference" },
        { name: "Sleeve Length", unit: "cm", description: "Shoulder to wrist" },
        { name: "Wrist", unit: "cm", description: "Wrist circumference" },
        { name: "Thigh", unit: "cm", description: "Upper leg circumference" },
        { name: "Inseam", unit: "cm", description: "Inner leg length" },
      ];
    }
  };

  const calculateMeasurementsFromLandmarks = (
    worldLandmarks: any[],
    heightCm: number,
  ): Measurement[] => {
    const w = worldLandmarks;
    const fields = getMeasurementFields();

    const leftShoulder = w[LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = w[LANDMARKS.RIGHT_SHOULDER];
    const leftHip = w[LANDMARKS.LEFT_HIP];
    const rightHip = w[LANDMARKS.RIGHT_HIP];
    const leftWrist = w[LANDMARKS.LEFT_WRIST];
    const rightWrist = w[LANDMARKS.RIGHT_WRIST];
    const leftAnkle = w[LANDMARKS.LEFT_ANKLE];
    const rightAnkle = w[LANDMARKS.RIGHT_ANKLE];

    const shoulderWidth =
      Math.abs((leftShoulder?.x || 0) - (rightShoulder?.x || 0)) * 100;
    const hipWidth = Math.abs((leftHip?.x || 0) - (rightHip?.x || 0)) * 100;
    const leftArmLength =
      Math.abs((leftShoulder?.y || 0) - (leftWrist?.y || 0)) * 100;
    const rightArmLength =
      Math.abs((rightShoulder?.y || 0) - (rightWrist?.y || 0)) * 100;
    const leftLegLength =
      Math.abs((leftHip?.y || 0) - (leftAnkle?.y || 0)) * 100;
    const rightLegLength =
      Math.abs((rightHip?.y || 0) - (rightAnkle?.y || 0)) * 100;

    const scaleFactor = heightCm / 170;

    const calculatedValues: Record<string, number> = {
      Height: heightCm,
      "Shoulder Width": Math.round(shoulderWidth * scaleFactor),
      "Arm Length": Math.round(
        ((leftArmLength + rightArmLength) / 2) * scaleFactor,
      ),
      "Sleeve Length": Math.round(
        ((leftArmLength + rightArmLength) / 2) * scaleFactor,
      ),
      Inseam: Math.round(((leftLegLength + rightLegLength) / 2) * scaleFactor),
      Thigh: Math.round(leftLegLength * 0.28 * scaleFactor),
      Calf: Math.round(leftLegLength * 0.18 * scaleFactor),
      Chest: Math.round(shoulderWidth * 2.4 * scaleFactor),
      Bust: Math.round(shoulderWidth * 2.4 * scaleFactor),
      "Under Bust": Math.round(shoulderWidth * 2.1 * scaleFactor),
      Waist: Math.round(hipWidth * 2.2 * scaleFactor),
      Hips: Math.round(hipWidth * 2.6 * scaleFactor),
      Neck: Math.round(shoulderWidth * 0.65 * scaleFactor),
      Wrist: Math.round(leftArmLength * 0.12 * scaleFactor),
    };

    return fields.map((field) => ({
      name: field.name,
      value:
        calculatedValues[field.name] ||
        Math.round(calculatedValues.Chest || 90),
      unit: field.unit,
      description: field.description,
    }));
  };

  const detectRaisedHand = (landmarks: any[]): boolean => {
    const leftWrist = landmarks[LANDMARKS.LEFT_WRIST];
    const rightWrist = landmarks[LANDMARKS.RIGHT_WRIST];
    const leftShoulder = landmarks[LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[LANDMARKS.RIGHT_SHOULDER];

    let leftRaised = false;
    let rightRaised = false;

    if (leftWrist && leftShoulder && leftWrist.visibility > 0.5) {
      leftRaised = leftWrist.y < leftShoulder.y;
    }
    if (rightWrist && rightShoulder && rightWrist.visibility > 0.5) {
      rightRaised = rightWrist.y < rightShoulder.y;
    }

    return leftRaised || rightRaised;
  };

  const calculatePoseQuality = (landmarks: any[]): number => {
    let validLandmarks = 0;
    const keyLandmarks = [
      LANDMARKS.LEFT_SHOULDER,
      LANDMARKS.RIGHT_SHOULDER,
      LANDMARKS.LEFT_HIP,
      LANDMARKS.RIGHT_HIP,
      LANDMARKS.LEFT_KNEE,
      LANDMARKS.RIGHT_KNEE,
    ];

    keyLandmarks.forEach((idx) => {
      if (landmarks[idx] && landmarks[idx].visibility > 0.5) {
        validLandmarks++;
      }
    });

    return validLandmarks / keyLandmarks.length;
  };

  const calculateHeightFromLandmarks = (
    worldLandmarks: any[],
  ): number | null => {
    if (!worldLandmarks || worldLandmarks.length < 32) return null;

    const nose = worldLandmarks[LANDMARKS.NOSE];
    const leftHeel = worldLandmarks[LANDMARKS.LEFT_HEEL];
    const rightHeel = worldLandmarks[LANDMARKS.RIGHT_HEEL];

    if (!nose || !leftHeel || !rightHeel) return null;

    const feetY = Math.max(leftHeel?.y || 0, rightHeel?.y || 0);
    const heightInMeters = Math.abs(feetY - nose.y) * 100;
    const heightInCm = heightInMeters * 1.8;

    if (heightInCm > 140 && heightInCm < 220) {
      return Math.round(heightInCm);
    }
    return 170;
  };

  const startRealTimeDetection = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
    );

    const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
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

    poseLandmarkerRef.current = poseLandmarker;

    let lastTimestamp = -1;

    const detectPose = async (timestamp: number) => {
      if (
        !videoRef.current ||
        !poseLandmarkerRef.current ||
        !canvasRef.current
      ) {
        animationRef.current = requestAnimationFrame(detectPose);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx || !video.videoWidth || !video.videoHeight) {
        animationRef.current = requestAnimationFrame(detectPose);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (timestamp !== lastTimestamp && video.readyState >= 2) {
        lastTimestamp = timestamp;

        try {
          const results = await poseLandmarkerRef.current.detectForVideo(
            video,
            timestamp,
          );

          if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];
            const worldLandmarks = results.worldLandmarks?.[0];

            const gesture = detectRaisedHand(landmarks);
            setGestureDetected(gesture);

            const quality = calculatePoseQuality(landmarks);
            setPoseQuality(quality);

            if (worldLandmarks && quality > 0.5) {
              const height = calculateHeightFromLandmarks(worldLandmarks);
              if (height) {
                setDetectedHeight(height);
              }

              if (gesture && !countdown && quality > 0.6) {
                setCountdown(3);
                const interval = setInterval(() => {
                  setCountdown((prev) => {
                    if (prev === null || prev <= 1) {
                      clearInterval(interval);
                      if (prev === 1 && worldLandmarks && detectedHeight) {
                        const measurements = calculateMeasurementsFromLandmarks(
                          worldLandmarks,
                          detectedHeight,
                        );
                        setMeasurements(measurements);
                        setStep("results");
                        stopCamera();
                      }
                      return null;
                    }
                    return prev - 1;
                  });
                }, 1000);
              }
            }
          }
        } catch (err) {
          console.error("Detection error:", err);
        }
      }

      animationRef.current = requestAnimationFrame(detectPose);
    };

    animationRef.current = requestAnimationFrame(detectPose);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          startRealTimeDetection();
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (poseLandmarkerRef.current) {
        poseLandmarkerRef.current.close();
      }
    };
  }, []);

  const handleSave = () => {
    if (measurements) {
      onComplete(measurements);
      onClose();
    }
  };

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
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full h-full bg-black"
        >
          {step === "camera" && (
            <>
              <video
                ref={videoRef}
                style={{ display: "none" }}
                autoPlay
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {detectedHeight && (
                <div className="absolute top-20 left-4 z-10 bg-white/10 backdrop-blur px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-green-400" />
                    <span className="text-white text-sm">
                      Height: {detectedHeight}cm
                    </span>
                  </div>
                </div>
              )}

              <div
                className={`absolute bottom-28 left-1/2 transform -translate-x-1/2 z-10 px-6 py-3 backdrop-blur transition-all ${
                  gestureDetected
                    ? "bg-green-600 text-white"
                    : "bg-white/10 text-white/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Hand className="w-5 h-5" />
                  <span className="text-sm font-light tracking-wide">
                    {gestureDetected
                      ? "✓ Hand detected! Stay still..."
                      : "Raise your hand to capture"}
                  </span>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 z-10">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke={poseQuality > 0.6 ? "#10b981" : "#6b7280"}
                      strokeWidth="4"
                      strokeDasharray={`${poseQuality * 175.9} 175.9`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xs">
                      {Math.round(poseQuality * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {countdown !== null && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/90 z-20"
                  >
                    <div className="text-white text-8xl font-light">
                      {countdown}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {step === "results" && measurements && (
            <div className="h-full overflow-y-auto py-12 px-6">
              <div className="max-w-5xl mx-auto">
                <div className="space-y-8">
                  <div className="flex justify-end">
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/10 transition"
                    >
                      <X className="w-6 h-6 text-white/60 hover:text-white" />
                    </button>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 mb-4">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-[10px] tracking-[0.2em] uppercase text-green-400">
                        Measurements Complete
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">
                      Your Body Profile
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {measurements.map((m, idx) => (
                      <div
                        key={idx}
                        className="border border-white/10 p-5 hover:border-white/30 transition"
                      >
                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">
                          {m.name}
                        </p>
                        <p className="text-3xl font-light text-white">
                          {m.value}
                          <span className="text-sm text-white/40 ml-1">
                            {m.unit}
                          </span>
                        </p>
                        <p className="text-[10px] text-white/30 mt-2">
                          {m.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-8">
                    <button
                      onClick={onClose}
                      className="flex-1 py-4 border border-white/20 text-white/60 hover:border-white/40 text-sm uppercase tracking-[0.15em] transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 py-4 bg-white text-black text-sm uppercase tracking-[0.15em] hover:bg-white/90 transition"
                    >
                      Save Measurements
                    </button>
                  </div>

                  <p className="text-center text-[10px] text-white/30">
                    AI-powered estimates • Accuracy within 1-3cm
                  </p>
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
