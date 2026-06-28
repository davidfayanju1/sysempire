import { useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  Upload,
  Image,
  PenTool,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { getBrowseStyles } from "../../lib/style-inspiration";
import { uploadMedia } from "../../services";

interface StepInspirationProps {
  onBack: () => void;
  onNext: (
    hasInspiration: boolean,
    image?: string,
    description?: string,
  ) => void;
  outfitType: string | null;
}

const StepInspiration = ({
  onBack,
  onNext,
  outfitType,
}: StepInspirationProps) => {
  const [selectedMethod, setSelectedMethod] = useState<
    "upload" | "describe" | "browse" | null
  >(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (selectedMethod === "upload" && uploadedFile) {
      setIsUploading(true);
      try {
        const res = await uploadMedia(uploadedFile);
        const cdnUrl: string =
          res.data?.url ??
          res.data?.file?.url ??
          res.data?.secure_url ??
          res.data;
        onNext(true, cdnUrl);
      } catch {
        toast.error("Image upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    } else if (selectedMethod === "describe" && description.trim()) {
      onNext(true, undefined, description);
    } else if (selectedMethod === "browse" && selectedStyle) {
      onNext(true, selectedStyle);
    }
  };

  const getOutfitTypeName = () => {
    switch (outfitType) {
      case "native-wear":
        return "Native Wear";
      case "corporate":
        return "Corporate Wear";
      case "dresses":
        return "Dresses";
      case "suits":
        return "Suits";
      case "casual":
        return "Casual Wear";
      case "wedding":
        return "Wedding Wear";
      case "uniforms":
        return "Uniforms";
      default:
        return "outfit";
    }
  };

  const browseStyles = getBrowseStyles(outfitType);

  if (!selectedMethod) {
    return (
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-12">
          <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
            Step 02
          </span>
          <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
            Do you already have a design in mind?
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Share your vision for your {getOutfitTypeName()} with us however
            it's easiest for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <button
            onClick={() => setSelectedMethod("upload")}
            className="p-8 bg-white border border-black/5 hover:border-black/20 transition-all text-center"
          >
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-5 h-5 text-black/60" />
            </div>
            <h3 className="text-lg font-medium mb-2">Upload Image</h3>
            <p className="text-xs text-gray-400">
              Screenshot, Pinterest, Instagram
            </p>
          </button>

          <button
            onClick={() => setSelectedMethod("describe")}
            className="p-8 bg-white border border-black/5 hover:border-black/20 transition-all text-center"
          >
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <PenTool className="w-5 h-5 text-black/60" />
            </div>
            <h3 className="text-lg font-medium mb-2">Describe It</h3>
            <p className="text-xs text-gray-400">Tell us in your own words</p>
          </button>

          <button
            onClick={() => setSelectedMethod("browse")}
            className="p-8 bg-white border border-black/5 hover:border-black/20 transition-all text-center"
          >
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image className="w-5 h-5 text-black/60" />
            </div>
            <h3 className="text-lg font-medium mb-2">Browse Styles</h3>
            <p className="text-xs text-gray-400">
              Explore {getOutfitTypeName()} styles
            </p>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <button
        onClick={() => {
          setSelectedMethod(null);
          setSelectedStyle(null);
        }}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition mb-8"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to options
      </button>

      <div className="text-center mb-12">
        <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
          Step 02
        </span>
        <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
          {selectedMethod === "upload" && "Share your inspiration image"}
          {selectedMethod === "describe" && "Describe your dream outfit"}
          {selectedMethod === "browse" &&
            `Choose a ${getOutfitTypeName()} style that inspires you`}
        </h2>
        {selectedMethod === "browse" && (
          <p className="text-gray-500 max-w-lg mx-auto">
            Select a style close to what you're looking for. We'll use this as
            inspiration for your custom {getOutfitTypeName().toLowerCase()}.
          </p>
        )}
      </div>

      {selectedMethod === "upload" && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {!uploadedImage ? (
            <label className="block border-2 border-dashed border-black/10 hover:border-black/30 transition-all p-12 text-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-black/40 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Click to upload an image</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
            </label>
          ) : (
            <div className="relative">
              <img
                src={uploadedImage}
                alt="Inspiration"
                className="w-full max-h-96 object-contain bg-gray-50"
              />
              <button
                onClick={() => {
                  setUploadedImage(null);
                  setUploadedFile(null);
                }}
                className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white"
              >
                <X className="w-4 h-4 text-black" />
              </button>
            </div>
          )}
        </div>
      )}

      {selectedMethod === "describe" && (
        <div className="max-w-2xl mx-auto">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`Describe your vision for your ${getOutfitTypeName().toLowerCase()}... colors, style, mood, occasion, anything that helps us understand what you want.`}
            rows={6}
            className="w-full p-4 border border-black/10 focus:border-black/40 outline-none transition resize-none text-gray-700 placeholder:text-gray-300"
          />
        </div>
      )}

      {selectedMethod === "browse" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {browseStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.image)}
              className={`group relative aspect-[3/4] overflow-hidden bg-gray-100 border transition-all ${
                selectedStyle === style.image
                  ? "border-black"
                  : "border-black/5 hover:border-black/20"
              }`}
            >
              <img
                src={style.image}
                alt={style.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <p className="text-white text-sm font-light">{style.name}</p>
              </div>
              {selectedStyle === style.image && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-black border border-white">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-8 max-w-2xl mx-auto">
        <button
          onClick={() => {
            setSelectedMethod(null);
            setSelectedStyle(null);
          }}
          className="flex-1 py-3 border border-black/20 text-black/60 text-sm uppercase tracking-wider hover:border-black/40 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={
            isUploading ||
            (selectedMethod === "upload" && !uploadedImage) ||
            (selectedMethod === "describe" && !description.trim()) ||
            (selectedMethod === "browse" && !selectedStyle)
          }
          className="flex-1 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              Continue <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </section>
  );
};

export default StepInspiration;
