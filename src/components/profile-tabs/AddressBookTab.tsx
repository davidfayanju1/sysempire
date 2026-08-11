import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../../store/authStore";
import type { Address } from "../../store/authStore";

const EMPTY_FORM = {
  name: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

const AddressBookTab = () => {
  const { user, addAddress, updateAddress, removeAddress, setDefaultAddress } =
    useAuthStore();
  const addresses = user?.addresses ?? [];

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (address: Address) => {
    setEditingId(address.id);
    setForm({
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const existing = addresses.find((a) => a.id === editingId);
      updateAddress(editingId, { ...form, isDefault: existing?.isDefault ?? false });
      toast.success("Address updated.");
    } else {
      addAddress({ ...form, isDefault: false });
      toast.success("Address added.");
    }
    closeForm();
  };

  const handleRemove = (id: string) => {
    removeAddress(id);
    toast.success("Address removed.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {addresses.length === 0 && !showForm && (
        <div className="border border-black/10 p-10 text-center">
          <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-5 h-5 text-black/40" />
          </div>
          <h4 className="font-medium text-black tracking-wide mb-1">
            No saved addresses yet
          </h4>
          <p className="text-black/50 text-sm max-w-xs mx-auto">
            Add an address to speed through checkout next time you order.
          </p>
        </div>
      )}

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
              <button
                onClick={() => openEditForm(address)}
                className="text-xs uppercase tracking-[0.15em] text-black/50 hover:text-black transition"
              >
                Edit
              </button>
              {!address.isDefault && (
                <button
                  onClick={() => setDefaultAddress(address.id)}
                  className="text-xs uppercase tracking-[0.15em] text-black/50 hover:text-black transition"
                >
                  Set as Default
                </button>
              )}
              <button
                onClick={() => handleRemove(address.id)}
                className="text-xs uppercase tracking-[0.15em] text-black/50 hover:text-red-600 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="border border-black/10 p-5 space-y-5 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-black tracking-wide">
                {editingId ? "Edit Address" : "Add New Address"}
              </h4>
              <button
                type="button"
                onClick={closeForm}
                className="text-black/40 hover:text-black transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-2">
                  Label (e.g. Home, Work)
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={closeForm}
                className="px-8 py-3 border border-black/20 text-black/60 text-xs uppercase tracking-[0.15em] hover:border-black hover:text-black transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.15em] hover:bg-black/80 transition"
              >
                {editingId ? "Save Changes" : "Add Address"}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.button
            key="add-button"
            onClick={openAddForm}
            className="w-full py-4 border border-black/20 text-black/60 hover:border-black hover:text-black transition flex items-center justify-center gap-2 text-xs uppercase tracking-[0.15em]"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddressBookTab;
