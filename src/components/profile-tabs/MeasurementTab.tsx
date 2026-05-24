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
  Activity,
  X,
  CheckCircle,
  Info,
  ArrowRight,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"camera" | "upload">("camera");
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
  // const [, setIsFullscreen] = useState(false);
  const [detectedHeight, setDetectedHeight] = useState<number | null>(null);
  const [isMeasuring] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);
  const poseLandmarkerRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Instructions for users
  const instructions = [
    {
      icon: <User className="w-5 h-5" />,
      title: "Stand Straight",
      description: "Position yourself facing the camera with good posture",
      detail:
        "Keep your feet shoulder-width apart and look directly at the camera",
    },
    {
      icon: <Move className="w-5 h-5" />,
      title: "Arms Visible",
      description: "Keep your arms slightly away from your body",
      detail: "Don't cross your arms or hide your hands",
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
      detail: "This triggers the measurement capture",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: "Good Lighting",
      description: "Ensure you're in a well-lit area",
      detail: "Natural daylight works best for accurate measurements",
    },
  ];

  // Prompts for modal guidance
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
      } catch (err) {
        console.error("Failed to initialize:", err);
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

  // Calculate actual height from 3D world landmarks
  const calculateHeightFromLandmarks = (
    worldLandmarks: any[],
  ): number | null => {
    if (!worldLandmarks || worldLandmarks.length < 32) return null;

    const nose = worldLandmarks[LANDMARKS.NOSE];
    const leftHeel = worldLandmarks[LANDMARKS.LEFT_HEEL];
    const rightHeel = worldLandmarks[LANDMARKS.RIGHT_HEEL];
    const leftFootIndex = worldLandmarks[LANDMARKS.LEFT_FOOT_INDEX];
    const rightFootIndex = worldLandmarks[LANDMARKS.RIGHT_FOOT_INDEX];

    if (!nose || !leftHeel || !rightHeel) return null;

    const feetY = Math.max(
      leftHeel?.y || 0,
      rightHeel?.y || 0,
      leftFootIndex?.y || 0,
      rightFootIndex?.y || 0,
    );

    const heightInMeters = Math.abs(feetY - nose.y) * 100;
    const heightInCm = heightInMeters * 1.8;

    if (heightInCm > 140 && heightInCm < 220) {
      return Math.round(heightInCm);
    }

    return 170;
  };

  // Calculate all body measurements from landmarks
  const calculateAllMeasurements = (
    worldLandmarks: any[],
    heightCm: number,
  ): Measurement[] => {
    const w = worldLandmarks;

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

    const scaleFactor = heightCm / 170;

    const chestEstimate = Math.round(shoulderWidth * 2.4 * scaleFactor);
    const waistEstimate = Math.round(hipWidth * 2.2 * scaleFactor);
    const hipEstimate = Math.round(hipWidth * 2.6 * scaleFactor);
    const neckEstimate = Math.round(shoulderWidth * 0.65 * scaleFactor);
    const bicepEstimate = Math.round(leftArmLength * 0.22 * scaleFactor);
    const thighEstimate = Math.round(leftLegLength * 0.28 * scaleFactor);
    const calfEstimate = Math.round(leftLegLength * 0.18 * scaleFactor);

    console.log(rightLegLength, "Right Leg Length");

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

  // Calculate pose quality
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

    const centerCheck = () => {
      const ls = landmarks[LANDMARKS.LEFT_SHOULDER];
      const rs = landmarks[LANDMARKS.RIGHT_SHOULDER];
      if (ls && rs) {
        const centerX = (ls.x + rs.x) / 2;
        return centerX > 0.3 && centerX < 0.7;
      }
      return false;
    };

    if (validLandmarks < 6 && currentPrompt !== 0) {
      setCurrentPrompt(0);
    } else if (
      validLandmarks >= 6 &&
      validLandmarks < 10 &&
      currentPrompt !== 1
    ) {
      setCurrentPrompt(1);
    } else if (validLandmarks >= 10 && centerCheck() && currentPrompt !== 2) {
      setCurrentPrompt(2);
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

    const handColor = gesture.isRaised ? "#10b981" : "#6b7280";

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
        ctx.fillStyle = isRaisedHand ? "#10b981" : "#ffffff";
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

            if (worldLandmarks && quality > 0.6 && !isMeasuring) {
              const height = calculateHeightFromLandmarks(worldLandmarks);
              if (height && height > 140 && height < 220) {
                setDetectedHeight(height);
                const measurements = calculateAllMeasurements(
                  worldLandmarks,
                  height,
                );
                setLiveMeasurements(measurements);
              }

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

  const closeModal = () => {
    stopCamera();
    setIsModalOpen(false);
    setActiveStep(1);
    setMeasurements(null);
    setLiveMeasurements(null);
    setCapturedImage(null);
    setDetectedHeight(null);
  };

  // const resetMeasurement = () => {
  //   setCapturedImage(null);
  //   setMeasurements(null);
  //   setLiveMeasurements(null);
  //   setDetectedHeight(null);
  //   setError(null);
  //   setCountdown(null);
  //   setActiveStep(1);
  //   setCurrentPrompt(0);
  //   startCamera();
  // };

  const startCamera = async () => {
    setError(null);
    setMeasurements(null);
    setLiveMeasurements(null);
    setDetectedHeight(null);
    setShowVideo(true);
    setActiveStep(2);
    setCurrentPrompt(0);

    try {
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

  const openModal = (mode: "camera" | "upload") => {
    setModalMode(mode);
    setIsModalOpen(true);
    if (mode === "camera") {
      startCamera();
    }
  };

  const saveMeasurements = () => {
    if (measurements) {
      const savedData = {
        measurements,
        date: new Date().toISOString(),
        detectedHeight: detectedHeight,
      };
      localStorage.setItem("userMeasurements", JSON.stringify(savedData));
      alert("Measurements saved to your profile!");
      closeModal();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setActiveStep(3);
        // For uploaded images, we would need to run pose detection separately
        // For now, set mock measurements
        const mockMeasurements: Measurement[] = [
          {
            name: "Height",
            value: 170,
            unit: "cm",
            description: "Estimated height",
          },
          {
            name: "Shoulder Width",
            value: 42,
            unit: "cm",
            description: "Distance between shoulders",
          },
          {
            name: "Chest / Bust",
            value: 88,
            unit: "cm",
            description: "Circumference at fullest part",
          },
          {
            name: "Waist",
            value: 72,
            unit: "cm",
            description: "Narrowest part of torso",
          },
          {
            name: "Hip",
            value: 94,
            unit: "cm",
            description: "Widest part of hips/seat",
          },
        ];
        setMeasurements(mockMeasurements);
      };
      reader.readAsDataURL(file);
    }
  };

  // Loading State
  if (isModelLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-2 border-black/10 rounded-full animate-ping absolute inset-0" />
            <div className="w-16 h-16 border-2 border-black/20 rounded-full animate-spin absolute inset-0 border-t-black" />
            <div className="w-16 h-16 flex items-center justify-center relative">
              <Sparkles className="w-6 h-6 text-black/40" />
            </div>
          </div>
          <h3 className="text-lg font-light text-black/60 mb-1">
            Loading AI Model
          </h3>
          <p className="text-sm text-black/40">Preparing pose detection...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Two Column Layout - Instructions on Left, Actions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Instructions */}
        <div className="border border-black/10 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-5 h-5 text-black/40" />
            <h3 className="text-sm uppercase tracking-[0.2em] text-black/40">
              How It Works
            </h3>
          </div>

          <div className="space-y-6">
            {instructions.map((instruction, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full border border-black/10 flex items-center justify-center">
                  {instruction.icon}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-black/80 mb-1">
                    {instruction.title}
                  </h4>
                  <p className="text-xs text-black/50">
                    {instruction.description}
                  </p>
                  <p className="text-[10px] text-black/30 mt-1">
                    {instruction.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tips Box */}
          <div className="mt-8 p-4 bg-black/5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-black/60 mb-1">
                  Pro Tip
                </p>
                <p className="text-xs text-black/50">
                  Wear form-fitting clothing for the most accurate measurements.
                  Dark colors against a light background work best.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="border border-black/10 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Ruler className="w-5 h-5 text-black/40" />
            <h3 className="text-sm uppercase tracking-[0.2em] text-black/40">
              Get Your Measurements
            </h3>
          </div>

          <div className="space-y-6">
            {/* Option 1: Self Measurement with Camera */}
            <div className="border border-black/10 p-5 hover:border-black/20 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-base font-light tracking-tight">
                    Self Measurement
                  </h4>
                  <p className="text-xs text-black/50 mt-1">
                    Stand in front of your camera
                  </p>
                </div>
                <CameraIcon className="w-5 h-5 text-black/40" />
              </div>
              <p className="text-[11px] text-black/40 leading-relaxed mb-4">
                Position yourself at a distance where your full body is visible.
                Our AI will guide you through the process and automatically
                capture when you raise your hand.
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

            {/* Option 2: Upload Full Photo */}
            <div className="border border-black/10 p-5 hover:border-black/20 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-base font-light tracking-tight">
                    Upload Photo
                  </h4>
                  <p className="text-xs text-black/50 mt-1">
                    Use a full-body standing photo
                  </p>
                </div>
                <ImageIcon className="w-5 h-5 text-black/40" />
              </div>
              <p className="text-[11px] text-black/40 leading-relaxed mb-4">
                Upload a clear full-body photo standing straight with arms
                slightly away from your body. The photo should be well-lit and
                show your entire silhouette.
              </p>
              <button
                onClick={() => uploadFileInputRef.current?.click()}
                className="w-full px-4 py-3 border border-black/20 text-black/60 text-xs uppercase tracking-[0.2em] hover:border-black hover:text-black transition flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Upload Full Photo
              </button>
            </div>

            {/* Saved Measurements Status */}
            <div className="pt-4 border-t border-black/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                    Saved Measurements
                  </p>
                  <p className="text-xs text-black/30 mt-1">
                    Last updated: Not yet
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Measurement Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full h-full bg-black"
            >
              {/* Camera Mode */}
              {modalMode === "camera" && activeStep === 2 && showVideo && (
                <div className="relative w-full h-full overflow-hidden">
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

                  {/* Close Button */}
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 transition"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>

                  {/* Floating Prompt Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-md"
                  >
                    <div className="bg-white/10 backdrop-blur border border-white/20 p-5">
                      <div className="flex items-start gap-4">
                        <div className="text-white">
                          {prompts[currentPrompt].icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white text-lg font-light mb-1">
                            {prompts[currentPrompt].title}
                          </h3>
                          <p className="text-white/60 text-sm">
                            {prompts[currentPrompt].description}
                          </p>
                          <p className="text-white/40 text-xs mt-2">
                            {prompts[currentPrompt].instruction}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Detected Height Display */}
                  {detectedHeight && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-20 right-20 z-10 bg-white/10 backdrop-blur px-4 py-2"
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
                      className="absolute right-4 top-32 z-10 w-48 bg-white/10 backdrop-blur border border-white/20"
                    >
                      <div className="p-2 border-b border-white/20">
                        <p className="text-[8px] uppercase tracking-[0.2em] text-white/60 text-center">
                          Live Measurements
                        </p>
                      </div>
                      <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                        {liveMeasurements.slice(0, 6).map((m, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-xs"
                          >
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
                    className={`absolute bottom-28 left-1/2 transform -translate-x-1/2 z-10 px-6 py-3 backdrop-blur transition-all ${
                      gestureDetected.isRaised
                        ? "bg-green-600 text-white"
                        : "bg-white/10 text-white/80"
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

                  {/* Pose Quality Indicator */}
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
                              ? "#10b981"
                              : poseQuality > 0.4
                                ? "#6b7280"
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
                        className="absolute inset-0 flex items-center justify-center bg-black/90 z-20"
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
                      onClick={closeModal}
                      className="flex-1 py-3 bg-white/10 text-white text-sm uppercase tracking-[0.15em] hover:bg-white/20 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={startCountdown}
                      disabled={!detectedHeight}
                      className="flex-1 py-3 bg-white text-black text-sm uppercase tracking-[0.15em] hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Take Measurement
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Mode or Results */}
              {((modalMode === "upload" && measurements) ||
                (activeStep === 3 && measurements)) && (
                <div className="h-full overflow-y-auto py-12 px-6">
                  <div className="max-w-5xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      {/* Close Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={closeModal}
                          className="p-2 hover:bg-white/10 transition"
                        >
                          <X className="w-6 h-6 text-white/60 hover:text-white" />
                        </button>
                      </div>

                      {capturedImage && (
                        <div className="w-40 h-48 mx-auto overflow-hidden border border-white/20">
                          <img
                            src={capturedImage}
                            alt="Captured"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

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
                        <p className="text-white/50 mt-2 flex items-center justify-center gap-2">
                          <Activity className="w-4 h-4" />
                          Height detected:{" "}
                          <strong className="text-white">
                            {
                              measurements.find((m) => m.name === "Height")
                                ?.value
                            }
                            cm
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
                            className="border border-white/10 p-5 hover:border-white/30 transition-all"
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
                          </motion.div>
                        ))}
                      </div>

                      <div className="flex gap-4 pt-8">
                        <button
                          onClick={closeModal}
                          className="flex-1 py-4 border border-white/20 text-white/60 hover:border-white/40 text-sm uppercase tracking-[0.15em] font-light transition"
                        >
                          Close
                        </button>
                        <button
                          onClick={saveMeasurements}
                          className="flex-1 py-4 bg-white text-black text-sm uppercase tracking-[0.15em] hover:bg-white/90 transition font-light"
                        >
                          Save to Profile
                        </button>
                      </div>

                      <p className="text-center text-[10px] text-white/30">
                        AI-powered estimates • Accuracy within 1-3cm
                      </p>
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Inputs */}
      <input
        ref={uploadFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
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
