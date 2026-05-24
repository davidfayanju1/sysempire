const Founder = () => {
  return (
    <section className="bg-white text-black py-16 md:py-24 font-sans selection:bg-black selection:text-white">
      <div className="container mx-auto px-4 max-w-[1100px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* LEFT COLUMN: EXTRA LARGE IMAGE FRAME WITH BLACK BORDER */}
          <div className="col-span-1 md:col-span-6 lg:col-span-5 w-full">
            {/* 1px clean crisp border around the entire image block layout */}
            <div className="border border-black bg-white flex flex-col">
              {/* Inner container with a 1px border around the photo block matching the mockup */}
              <div className="p-0 border-b border-black aspect-[4/5] w-full overflow-hidden">
                <img
                  src="/images/owner.png" // Replace with your exact filename in the public folder
                  alt="Martin Gyllenhal"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Label Metadata Section underneath the image */}
              <div className="p-6 pt-5 pb-7 flex justify-between items-end bg-white">
                <div>
                  <h3 className="text-2xl md:text-3xl font-normal tracking-tight text-black leading-none">
                    Oluwayanju Adesewa
                  </h3>
                  <p className="text-xs text-gray-500 font-medium tracking-wider mt-2.5 uppercase">
                    CEO & Founder
                  </p>
                </div>

                {/* Custom Monogram Signature Block */}
                <div className="h-11 text-black select-none pointer-events-none font-serif italic font-light text-3xl tracking-tighter leading-none px-1">
                  SYS
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: MASSIVE MANIFESTO TEXT TYPOGRAPHY */}
          <div className="col-span-1 md:col-span-6 lg:col-span-7 md:space-y-12 space-y-4 pt-4 md:pl-4">
            {/* Extra large headline matching the design scale */}
            <h2 className="text-5xl md:text-6xl lg:text-[76px] font-[300] tracking-tight text-black leading-[1.05]">
              What our founder says.
            </h2>

            {/* Maximized Quote blocks */}
            <div className="space-y-8 max-w-3xl">
              <p className="text-xl md:text-2xl lg:text-[27px] font-normal text-black leading-[1.45] tracking-tight">
                “At our studio, we believe in the extraordinary power of visual
                storytelling. Each project is more than just a job; it's a
                journey of creativity, collaboration, and passion.
              </p>

              <p className="text-xl md:text-2xl lg:text-[27px] font-[300] text-gray-400 leading-[1.45] tracking-tight">
                Our mission is to bring your stories to life in ways that
                captivate and inspire. Together, let's push the boundaries of
                what's possible and create visual masterpieces that leave a
                lasting impact.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
