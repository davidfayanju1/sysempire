import { motion } from "framer-motion";

const AddressBookTab = () => {
  const addresses = [
    {
      id: 1,
      name: "Home",
      street: "123 Fashion Avenue",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
      isDefault: true,
    },
    {
      id: 2,
      name: "Work",
      street: "456 Style Boulevard",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
      isDefault: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {addresses.map((address) => (
        <div key={address.id} className="border border-black/10 p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-medium text-black tracking-wide">
                  {address.name}
                </h4>
                {address.isDefault && (
                  <span className="text-[10px] uppercase tracking-[0.15em] text-black/40 border border-black/20 px-2 py-0.5">
                    Default
                  </span>
                )}
              </div>
              <p className="text-black/60 text-sm">{address.street}</p>
              <p className="text-black/60 text-sm">
                {address.city}, {address.state} {address.zip}
              </p>
              <p className="text-black/60 text-sm">{address.country}</p>
            </div>
            <div className="flex gap-4">
              <button className="text-xs uppercase tracking-[0.15em] text-black/50 hover:text-black transition">
                Edit
              </button>
              {!address.isDefault && (
                <button className="text-xs uppercase tracking-[0.15em] text-black/50 hover:text-black transition">
                  Set as Default
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      <button className="w-full py-4 border border-black/20 text-black/60 hover:border-black hover:text-black transition flex items-center justify-center gap-2 text-xs uppercase tracking-[0.15em]">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add New Address
      </button>
    </motion.div>
  );
};

export default AddressBookTab;
