import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitContact } from "../../services";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const nameParts = formData.name.trim().split(" ");
      const payload = {
        firstName: nameParts[0] || "Anonymous",
        lastName: nameParts.slice(1).join(" ") || "",
        email: formData.email || "",
        phone: "08161525556",
        service: "Custom Tailoring",
        message: formData.message,
      };
      return submitContact(payload);
    },
    onSuccess: () => {
      toast.success("Thank you! Your feedback has been received.");
      setFormData({ name: "", email: "", message: "" });
    },
    onError: () => {
      toast.error("Failed to send feedback. Please try again.");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!formData.message.trim()) {
      toast.error("Please enter your feedback before submitting.");
      return;
    }
    mutate();
  };

  return (
    <section className="bg-gray-100 text-black py-16 md:py-24 font-sans">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-black mb-4">
            We're not perfect.
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-light max-w-md mx-auto">
            Let us know what we can do better. Your honest feedback helps us
            grow.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-xs uppercase tracking-wider text-gray-400 mb-2"
            >
              Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="How should we address you?"
              className="w-full px-4 py-3 border border-black/10 bg-white text-black placeholder:text-gray-300 focus:outline-none focus:border-black/40 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-wider text-gray-400 mb-2"
            >
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="So we can follow up if needed"
              className="w-full px-4 py-3 border border-black/10 bg-white text-black placeholder:text-gray-300 focus:outline-none focus:border-black/40 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-xs uppercase tracking-wider text-gray-400 mb-2"
            >
              What can we do better? *
            </label>
            <textarea
              id="message"
              rows={5}
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us honestly... shipping, quality, design, customer service?"
              className="w-full px-4 py-3 border border-black/10 bg-white text-black placeholder:text-gray-300 focus:outline-none focus:border-black/40 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              "Send Feedback"
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">
          All feedback is anonymous unless you choose to share your contact.
        </p>
      </div>
    </section>
  );
};

export default Feedback;
