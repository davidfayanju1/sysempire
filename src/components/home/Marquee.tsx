const Marquee = () => {
  const materials = [
    "ANKARA",
    "LACE",
    "AGBADA",
    "ABAYA",
    "SUIT & CORPORATE",
    "CASUAL WEAR",
    "KENTE",
    "BROCADES",
    "DAMASK",
    "GEORGE FABRIC",
    "SEQUINS",
    "VELVET",
    "SATIN",
    "CHIFFON",
    "COTTON",
    "LINEN",
    "DENIM",
    "JERSEY",
    "TWEED",
    "SILK",
    "CREPE",
    "ORGANZA",
    "TULLE",
    "JACQUARD",
    "ADIRE",
    "BATIK",
    "TIE DYE",
    "MUD CLOTH",
  ];

  // Double the array for seamless loop
  const doubledMaterials = [...materials, ...materials];

  return (
    <div className="w-full overflow-hidden py-8 bg-black/5 border-y border-black/10">
      <div className="relative">
        <div
          className="flex whitespace-nowrap animate-marquee"
          style={{
            animation: "marquee 120s linear infinite",
            width: "max-content",
          }}
        >
          {doubledMaterials.map((material, index) => (
            <span
              key={index}
              className="text-black/60 text-xs md:text-sm tracking-[0.2em] uppercase mx-6 md:mx-8 font-['Times_New_Roman',serif]"
            >
              {material}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default Marquee;
