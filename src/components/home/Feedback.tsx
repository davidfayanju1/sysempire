const Feedback = () => {
  return (
    <section className="bg-gray-100 text-black py-16 md:py-24 font-sans">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-black mb-4">
            We're not perfect.
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-light max-w-md mx-auto">
            Let us know what we can do better. Your honest feedback helps us
            grow.
          </p>
        </div>

        <form className="space-y-6">
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
              placeholder="So we can follow up if needed"
              className="w-full px-4 py-3 border border-black/10 bg-white text-black placeholder:text-gray-300 focus:outline-none focus:border-black/40 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="feedback"
              className="block text-xs uppercase tracking-wider text-gray-400 mb-2"
            >
              What can we do better?
            </label>
            <textarea
              id="feedback"
              rows={5}
              placeholder="Tell us honestly... shipping, quality, design, customer service?"
              className="w-full px-4 py-3 border border-black/10 bg-white text-black placeholder:text-gray-300 focus:outline-none focus:border-black/40 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition-colors"
          >
            Send Feedback
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
