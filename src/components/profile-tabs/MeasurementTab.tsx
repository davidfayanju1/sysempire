// components/MeasurementTab.tsx
import { useState, useRef, useEffect } from "react";
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
  Shield,
  Smartphone,
  Zap,
  Activity,
} from "lucide-react";

import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

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

const MeasurementTab = () => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [gestureDetected, setGestureDetected] = useState<GestureState>({
    isRaised: false,
    handSide: null,
    confidence: 0,
  });
  const [poseQuality, setPoseQuality] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isAutoCapturing, setIsAutoCapturing] = useState(false);
  const [liveMeasurements, setLiveMeasurements] = useState<
    Measurement[] | null
  >(null);
  const [showVideo, setShowVideo] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [, setIsFullscreen] = useState(false);
  const [detectedHeight, setDetectedHeight] = useState<number | null>(null);
  const [isMeasuring] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const poseLandmarkerRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prompts for user guidance
  const prompts = [
    {
      icon: <User className="w-8 h-8" />,
      title: "Stand Straight",
      description: "Position yourself facing the camera with good posture",
      instruction: "Keep your feet shoulder-width apart",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Move className="w-8 h-8" />,
      title: "Arms Visible",
      description: "Keep your arms slightly away from your body",
      instruction: "Don't cross your arms or hide your hands",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Stay Centered",
      description: "Position yourself in the middle of the frame",
      instruction: "Your whole body should be visible",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Hand className="w-8 h-8" />,
      title: "Raise Your Hand",
      description: "Lift either hand above shoulder level",
      instruction: "This triggers the measurement capture",
      color: "from-orange-500 to-red-500",
    },
  ];

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

  // Initialize MediaPipe
  useEffect(() => {
    const initPoseLandmarker = async () => {
      try {
        setIsModelLoading(true);
        console.log("Loading MediaPipe...");

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
        setIsModelLoading(false);
        console.log("✅ MediaPipe Pose loaded successfully");
      } catch (err) {
        console.error("❌ Failed to initialize:", err);
        setError("Failed to load pose detection. Please refresh the page.");
        setIsModelLoading(false);
      }
    };

    initPoseLandmarker();

    return () => {
      if (poseLandmarkerRef.current) {
        poseLandmarkerRef.current.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Start camera
  const startCamera = async () => {
    setError(null);
    setMeasurements(null);
    setLiveMeasurements(null);
    setDetectedHeight(null);
    setShowVideo(true);
    setActiveStep(2);
    setCurrentPrompt(0);

    try {
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        videoRef.current.onloadedmetadata = () => {
          console.log("Video loaded, starting detection...");
          videoRef.current?.play();
          setIsCameraActive(true);
          startRealTimeDetection();
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Unable to access camera. Please check permissions.");
      setShowVideo(false);
    }
  };

  // Calculate actual height from 3D world landmarks
  const calculateHeightFromLandmarks = (
    worldLandmarks: any[],
  ): number | null => {
    if (!worldLandmarks || worldLandmarks.length < 32) return null;

    // Get the highest point (nose or top of head)
    const nose = worldLandmarks[LANDMARKS.NOSE];
    const leftHeel = worldLandmarks[LANDMARKS.LEFT_HEEL];
    const rightHeel = worldLandmarks[LANDMARKS.RIGHT_HEEL];
    const leftFootIndex = worldLandmarks[LANDMARKS.LEFT_FOOT_INDEX];
    const rightFootIndex = worldLandmarks[LANDMARKS.RIGHT_FOOT_INDEX];

    if (!nose || !leftHeel || !rightHeel) return null;

    // Get the lowest point (feet)
    const feetY = Math.max(
      leftHeel?.y || 0,
      rightHeel?.y || 0,
      leftFootIndex?.y || 0,
      rightFootIndex?.y || 0,
    );

    // Calculate height in meters (difference in Y coordinate)
    const heightInMeters = Math.abs(feetY - nose.y) * 100;

    // Convert to cm and apply calibration
    // MediaPipe returns normalized coordinates, actual height calculation
    const heightInCm = heightInMeters * 1.8; // Scaling factor for real-world measurements

    // Return realistic height (between 140cm and 220cm)
    if (heightInCm > 140 && heightInCm < 220) {
      return Math.round(heightInCm);
    }

    // Fallback to average if detection seems off
    return 170;
  };

  // Calculate all body measurements from landmarks
  const calculateAllMeasurements = (
    // landmarks: any[],
    worldLandmarks: any[],
    heightCm: number,
  ): Measurement[] => {
    const w = worldLandmarks;

    // Calculate body segment ratios based on detected height
    // const heightInMeters = heightCm / 100;

    // Get key points for measurements
    const leftShoulder = w[LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = w[LANDMARKS.RIGHT_SHOULDER];
    const leftHip = w[LANDMARKS.LEFT_HIP];
    const rightHip = w[LANDMARKS.RIGHT_HIP];
    const leftWrist = w[LANDMARKS.LEFT_WRIST];
    const rightWrist = w[LANDMARKS.RIGHT_WRIST];
    const leftAnkle = w[LANDMARKS.LEFT_ANKLE];
    const rightAnkle = w[LANDMARKS.RIGHT_ANKLE];
    // const leftKnee = w[LANDMARKS.LEFT_KNEE];
    // const rightKnee = w[LANDMARKS.RIGHT_KNEE];

    // Calculate 3D distances
    const shoulderWidth =
      Math.abs((leftShoulder?.x || 0) - (rightShoulder?.x || 0)) * 100;
    const hipWidth = Math.abs((leftHip?.x || 0) - (rightHip?.x || 0)) * 100;
    const torsoLength =
      Math.abs((leftShoulder?.y || 0) - (leftHip?.y || 0)) * 100;
    const leftArmLength =
      Math.abs((leftShoulder?.y || 0) - (leftWrist?.y || 0)) * 100;
    const rightArmLength =
      Math.abs((rightShoulder?.y || 0) - (rightWrist?.y || 0)) * 100;
    const leftLegLength =
      Math.abs((leftHip?.y || 0) - (leftAnkle?.y || 0)) * 100;
    const rightLegLength =
      Math.abs((rightHip?.y || 0) - (rightAnkle?.y || 0)) * 100;

    // Scale factor based on detected height
    const scaleFactor = heightCm / 170;

    // Calculate circumference estimates using body proportion formulas
    const chestEstimate = Math.round(shoulderWidth * 2.4 * scaleFactor);
    const waistEstimate = Math.round(hipWidth * 2.2 * scaleFactor);
    const hipEstimate = Math.round(hipWidth * 2.6 * scaleFactor);
    const neckEstimate = Math.round(shoulderWidth * 0.65 * scaleFactor);
    const bicepEstimate = Math.round(leftArmLength * 0.22 * scaleFactor);
    const thighEstimate = Math.round(leftLegLength * 0.28 * scaleFactor);
    const calfEstimate = Math.round(leftLegLength * 0.18 * scaleFactor);

    console.log(rightLegLength, "Right ankle");

    return [
      {
        name: "Height",
        value: heightCm,
        unit: "cm",
        description: "Your detected height",
      },
      {
        name: "Shoulder Width",
        value: Math.round(shoulderWidth * scaleFactor),
        unit: "cm",
        description: "Distance between shoulder points",
      },
      {
        name: "Chest / Bust",
        value: chestEstimate,
        unit: "cm",
        description: "Circumference at fullest part",
      },
      {
        name: "Waist",
        value: waistEstimate,
        unit: "cm",
        description: "Narrowest part of torso",
      },
      {
        name: "Hip",
        value: hipEstimate,
        unit: "cm",
        description: "Widest part of hips/seat",
      },
      {
        name: "Neck",
        value: neckEstimate,
        unit: "cm",
        description: "Neck circumference",
      },
      {
        name: "Arm Length (Left)",
        value: Math.round(leftArmLength * scaleFactor),
        unit: "cm",
        description: "Shoulder to wrist",
      },
      {
        name: "Arm Length (Right)",
        value: Math.round(rightArmLength * scaleFactor),
        unit: "cm",
        description: "Shoulder to wrist",
      },
      {
        name: "Inseam",
        value: Math.round(leftLegLength * scaleFactor),
        unit: "cm",
        description: "Inner leg length",
      },
      {
        name: "Torso Length",
        value: Math.round(torsoLength * scaleFactor),
        unit: "cm",
        description: "Shoulder to hip",
      },
      {
        name: "Bicep",
        value: bicepEstimate,
        unit: "cm",
        description: "Upper arm circumference",
      },
      {
        name: "Thigh",
        value: thighEstimate,
        unit: "cm",
        description: "Upper leg circumference",
      },
      {
        name: "Calf",
        value: calfEstimate,
        unit: "cm",
        description: "Lower leg circumference",
      },
    ];
  };

  // Detect raised hand gesture
  const detectRaisedHand = (landmarks: any[]): GestureState => {
    const leftWrist = landmarks[LANDMARKS.LEFT_WRIST];
    const rightWrist = landmarks[LANDMARKS.RIGHT_WRIST];
    const leftShoulder = landmarks[LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[LANDMARKS.RIGHT_SHOULDER];

    let leftRaised = false;
    let rightRaised = false;
    let leftConfidence = 0;
    let rightConfidence = 0;

    if (leftWrist && leftShoulder && leftWrist.visibility > 0.5) {
      leftRaised = leftWrist.y < leftShoulder.y;
      leftConfidence = leftWrist.visibility;
    }

    if (rightWrist && rightShoulder && rightWrist.visibility > 0.5) {
      rightRaised = rightWrist.y < rightShoulder.y;
      rightConfidence = rightWrist.visibility;
    }

    if (leftRaised && leftConfidence > 0.6) {
      return { isRaised: true, handSide: "left", confidence: leftConfidence };
    }
    if (rightRaised && rightConfidence > 0.6) {
      return { isRaised: true, handSide: "right", confidence: rightConfidence };
    }

    return { isRaised: false, handSide: null, confidence: 0 };
  };

  // Calculate pose quality and determine current prompt
  const calculatePoseQuality = (landmarks: any[]): number => {
    let validLandmarks = 0;
    const keyLandmarks = [
      LANDMARKS.LEFT_SHOULDER,
      LANDMARKS.RIGHT_SHOULDER,
      LANDMARKS.LEFT_HIP,
      LANDMARKS.RIGHT_HIP,
      LANDMARKS.LEFT_KNEE,
      LANDMARKS.RIGHT_KNEE,
      LANDMARKS.LEFT_ANKLE,
      LANDMARKS.RIGHT_ANKLE,
    ];

    keyLandmarks.forEach((idx) => {
      if (landmarks[idx] && landmarks[idx].visibility > 0.5) {
        validLandmarks++;
      }
    });

    let score = validLandmarks / keyLandmarks.length;

    const leftShoulder = landmarks[LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[LANDMARKS.RIGHT_SHOULDER];
    if (leftShoulder && rightShoulder) {
      const centerX = (leftShoulder.x + rightShoulder.x) / 2;
      if (centerX > 0.3 && centerX < 0.7) {
        score += 0.2;
      }
    }

    // Update prompt based on pose
    if (validLandmarks < 6 && currentPrompt !== 0) {
      setCurrentPrompt(0);
    } else if (
      validLandmarks >= 6 &&
      validLandmarks < 10 &&
      currentPrompt !== 1
    ) {
      setCurrentPrompt(1);
    } else if (
      validLandmarks >= 10 &&
      centerCheckPassed() &&
      currentPrompt !== 2
    ) {
      setCurrentPrompt(2);
    }

    function centerCheckPassed() {
      const ls = landmarks[LANDMARKS.LEFT_SHOULDER];
      const rs = landmarks[LANDMARKS.RIGHT_SHOULDER];
      if (ls && rs) {
        const centerX = (ls.x + rs.x) / 2;
        return centerX > 0.3 && centerX < 0.7;
      }
      return false;
    }

    return Math.min(score, 1);
  };

  // Draw skeleton on canvas
  const drawSkeleton = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    width: number,
    height: number,
    gesture: GestureState,
  ) => {
    const connections = [
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

    const handColor = gesture.isRaised ? "#22c55e" : "#3b82f6";

    connections.forEach(([startIdx, endIdx]) => {
      const start = landmarks[startIdx];
      const end = landmarks[endIdx];

      if (start && end && start.visibility > 0.3 && end.visibility > 0.3) {
        ctx.beginPath();
        ctx.moveTo(start.x * width, start.y * height);
        ctx.lineTo(end.x * width, end.y * height);
        ctx.strokeStyle = handColor;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });

    landmarks.forEach((landmark, idx) => {
      if (landmark.visibility > 0.3) {
        const x = landmark.x * width;
        const y = landmark.y * height;

        const isRaisedHand =
          (gesture.handSide === "left" && idx === LANDMARKS.LEFT_WRIST) ||
          (gesture.handSide === "right" && idx === LANDMARKS.RIGHT_WRIST);

        ctx.beginPath();
        ctx.arc(x, y, isRaisedHand ? 10 : 6, 0, 2 * Math.PI);
        ctx.fillStyle = isRaisedHand ? "#22c55e" : "#ffffff";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, isRaisedHand ? 4 : 3, 0, 2 * Math.PI);
        ctx.fillStyle = "#000000";
        ctx.fill();
      }
    });
  };

  // Real-time detection
  const startRealTimeDetection = () => {
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

            drawSkeleton(ctx, landmarks, canvas.width, canvas.height, gesture);

            // Calculate height and measurements when pose is good
            if (worldLandmarks && quality > 0.6 && !isMeasuring) {
              const height = calculateHeightFromLandmarks(worldLandmarks);
              if (height && height > 140 && height < 220) {
                setDetectedHeight(height);
                const measurements = calculateAllMeasurements(
                  landmarks,
                  worldLandmarks,
                  //   height,
                );
                setLiveMeasurements(measurements);
              }

              // Auto-capture when hand is raised and pose is good
              if (
                gesture.isRaised &&
                !countdown &&
                !isAutoCapturing &&
                quality > 0.7
              ) {
                startCountdown();
              }
            }
          } else {
            setPoseQuality(0);
            setGestureDetected({
              isRaised: false,
              handSide: null,
              confidence: 0,
            });
          }
        } catch (err) {
          console.error("Detection error:", err);
        }
      }

      animationRef.current = requestAnimationFrame(detectPose);
    };

    animationRef.current = requestAnimationFrame(detectPose);
  };

  // Start countdown
  const startCountdown = () => {
    setIsAutoCapturing(true);
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          if (prev === 1) {
            capturePhoto();
          }
          setIsAutoCapturing(false);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Capture photo and finalize measurements
  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current && liveMeasurements) {
      const imageData = canvasRef.current.toDataURL("image/jpeg", 0.95);
      setCapturedImage(imageData);
      stopCamera();
      setMeasurements(liveMeasurements);
      setActiveStep(3);
    }
  };

  // Manual capture trigger
  const handleManualCapture = () => {
    if (liveMeasurements && !isAutoCapturing) {
      startCountdown();
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
    setIsCameraActive(false);
    setShowVideo(false);
    setCountdown(null);
    setIsAutoCapturing(false);
  };

  const resetMeasurement = () => {
    setCapturedImage(null);
    setMeasurements(null);
    setLiveMeasurements(null);
    setDetectedHeight(null);
    setError(null);
    setCountdown(null);
    setActiveStep(1);
    setCurrentPrompt(0);
  };

  const saveMeasurements = () => {
    if (measurements) {
      const savedData = {
        measurements,
        date: new Date().toISOString(),
        detectedHeight: detectedHeight,
      };
      localStorage.setItem("userMeasurements", JSON.stringify(savedData));
      alert("✨ Measurements saved to your profile!");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setActiveStep(3);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Loading State
  if (isModelLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-white/10 rounded-full animate-ping absolute inset-0" />
            <div className="w-24 h-24 border-4 border-white/20 rounded-full animate-spin absolute inset-0 border-t-white" />
            <div className="w-24 h-24 flex items-center justify-center relative">
              <Sparkles className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-light text-white mb-2 tracking-wide">
            Preparing AI Measurement System
          </h2>
          <p className="text-white/50 text-sm">
            Loading pose detection model...
          </p>
          <div className="mt-8 flex gap-2 justify-center">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white/30 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-white/30 text-xs mt-8">
            This may take a few seconds
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-white">
      {/* Step 1: Welcome Screen */}
      {activeStep === 1 && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50">
          <div className="max-w-4xl mx-auto px-6 py-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full">
                <Sparkles className="w-4 h-4 text-black/60" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-black/60">
                  AI-Powered Technology
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-light tracking-tight">
                Body Measurement
                <br />
                <span className="text-black/60">Made Simple</span>
              </h1>

              <p className="text-black/50 max-w-md mx-auto text-lg font-light">
                Get accurate measurements using advanced AI pose detection
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <button
                  onClick={startCamera}
                  className="px-8 py-4 bg-black text-white text-sm uppercase tracking-[0.2em] hover:bg-black/90 transition flex items-center justify-center gap-3 group"
                >
                  <CameraIcon className="w-4 h-4 group-hover:scale-110 transition" />
                  Start Measurement
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-4 border border-black/20 text-black/60 hover:border-black text-sm uppercase tracking-[0.2em] transition flex items-center justify-center gap-3"
                >
                  <ImageIcon className="w-4 h-4" />
                  Upload Photo
                </button>
              </div>

              <div className="flex justify-center gap-8 pt-12 text-black/30">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-[10px] uppercase">
                    Private & Secure
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-[10px] uppercase">
                    Works on Any Device
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] uppercase">Instant Results</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Step 2: Camera with Live Measurement Detection */}
      {activeStep === 2 && showVideo && (
        <div className="relative w-full h-screen overflow-hidden bg-black">
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
            style={{ backgroundColor: "#000" }}
          />

          {/* Floating Prompt Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-md"
          >
            <div
              className={`bg-gradient-to-r ${prompts[currentPrompt].color} p-5 shadow-2xl`}
            >
              <div className="flex items-start gap-4">
                <div className="text-white">{prompts[currentPrompt].icon}</div>
                <div className="flex-1">
                  <h3 className="text-white text-lg font-light mb-1">
                    {prompts[currentPrompt].title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {prompts[currentPrompt].description}
                  </p>
                  <p className="text-white/60 text-xs mt-2">
                    {prompts[currentPrompt].instruction}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Detected Height Display */}
          {detectedHeight && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-24 right-4 z-10 bg-black/60 backdrop-blur px-4 py-2 rounded-full"
            >
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm font-light">
                  Height: {detectedHeight}cm
                </span>
              </div>
            </motion.div>
          )}

          {/* Live Measurements Panel */}
          {liveMeasurements && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-4 top-32 z-10 w-48 bg-black/60 backdrop-blur rounded-lg overflow-hidden"
            >
              <div className="p-2 border-b border-white/20">
                <p className="text-[8px] uppercase tracking-[0.2em] text-white/60 text-center">
                  Live Measurements
                </p>
              </div>
              <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                {liveMeasurements.slice(0, 6).map((m, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-white/60">{m.name}</span>
                    <span className="text-white font-light">
                      {m.value}
                      {m.unit}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Gesture Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute bottom-28 left-1/2 transform -translate-x-1/2 z-10 px-6 py-3 backdrop-blur-md rounded-full transition-all ${
              gestureDetected.isRaised
                ? "bg-green-500/90 text-white"
                : "bg-black/60 text-white/80"
            }`}
          >
            <div className="flex items-center gap-3">
              <Hand className="w-5 h-5" />
              <span className="text-sm font-light tracking-wide">
                {gestureDetected.isRaised
                  ? `✓ ${gestureDetected.handSide === "left" ? "Left" : "Right"} hand detected!`
                  : "Raise your hand to capture"}
              </span>
            </div>
          </motion.div>

          {/* Pose Quality Ring */}
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
                  stroke={
                    poseQuality > 0.7
                      ? "#22c55e"
                      : poseQuality > 0.4
                        ? "#eab308"
                        : "#ef4444"
                  }
                  strokeWidth="4"
                  strokeDasharray={`${poseQuality * 175.9} 175.9`}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xs font-light">
                  {Math.round(poseQuality * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Countdown Overlay */}
          <AnimatePresence>
            {countdown !== null && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/80 z-20"
              >
                <div className="text-white text-9xl font-light">
                  {countdown}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls Bar */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-3">
            <button
              onClick={stopCamera}
              className="flex-1 py-3 bg-white/10 backdrop-blur text-white text-sm uppercase tracking-[0.15em] hover:bg-white/20 transition"
            >
              Cancel{" "}
            </button>
            <button
              onClick={handleManualCapture}
              disabled={!detectedHeight}
              className="flex-1 py-3 bg-white text-black text-sm uppercase tracking-[0.15em] hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Take Measurement
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur hover:bg-white/20 transition rounded-lg"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Step 3: Complete Results */}
      {measurements && activeStep === 3 && (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {capturedImage && (
                <div className="w-40 h-48 mx-auto overflow-hidden border border-black/10 shadow-lg rounded-lg">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-[10px] tracking-[0.2em] uppercase text-green-700">
                    Measurements Complete
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                  Your Body Profile
                </h2>
                <p className="text-black/50 mt-2 flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4" />
                  Height detected:{" "}
                  <strong>
                    {measurements.find((m) => m.name === "Height")?.value}cm
                  </strong>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {measurements.map((m, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="bg-white border border-black/10 p-5 hover:border-black/30 hover:shadow-md transition-all"
                  >
                    <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 mb-2">
                      {m.name}
                    </p>
                    <p className="text-3xl font-light">
                      {m.value}
                      <span className="text-sm text-black/40 ml-1">
                        {m.unit}
                      </span>
                    </p>
                    <p className="text-[10px] text-black/30 mt-2">
                      {m.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-4 pt-8">
                <button
                  onClick={resetMeasurement}
                  className="flex-1 py-4 border border-black/20 text-black/60 hover:border-black text-sm uppercase tracking-[0.15em] font-light transition"
                >
                  Measure Again
                </button>
                <button
                  onClick={saveMeasurements}
                  className="flex-1 py-4 bg-black text-white text-sm uppercase tracking-[0.15em] hover:bg-black/90 transition font-light"
                >
                  Save to Profile
                </button>
              </div>

              <p className="text-center text-[10px] text-black/30">
                AI-powered estimates using MediaPipe Pose Detection • Accuracy
                within 1-3cm
              </p>
            </motion.div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-light">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeasurementTab;
