import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateMe, uploadAvatar } from "../../services";
import { useAuthStore } from "../../store/authStore";
import type { AuthUser } from "../../store/authStore";

const ProfileInfoTab = () => {
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  const { mutate: saveProfile, isPending: saving } = useMutation({
    mutationFn: () => updateMe({ firstName, lastName, phone }),
    onSuccess: (res) => {
      const updated: AuthUser = res.data?.user ?? res.data;
      setUser({ ...(user as AuthUser), ...updated });
      toast.success("Profile updated.");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? "Could not save changes.";
      toast.error(msg);
    },
  });

  const { mutate: saveAvatar, isPending: uploadingAvatar } = useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: (res) => {
      const updated: AuthUser = res.data?.user ?? res.data;
      setUser({ ...(user as AuthUser), ...updated });
      toast.success("Avatar updated.");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? "Avatar upload failed.";
      toast.error(msg);
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) saveAvatar(file);
    e.target.value = "";
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const memberSince = (user as any)?.createdAt
    ? new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(
        new Date((user as any).createdAt),
      )
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* Avatar */}
      <div className="flex flex-col items-start md:flex-row md:items-start gap-8 pb-8 border-b border-black/10">
        <div className="relative">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-24 h-24 object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-black flex items-center justify-center text-white text-2xl font-normal tracking-wide">
              {initials}
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute bottom-0 right-0 bg-white border border-black/20 p-1.5 hover:bg-black/5 transition disabled:opacity-50"
          >
            {uploadingAvatar ? (
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <h3 className="text-xl font-normal text-black tracking-wide">
            {(user?.fullName ?? `${firstName} ${lastName}`.trim()) || "—"}
          </h3>
          <p className="text-black/50 text-sm mt-1">{user?.email ?? "—"}</p>
          {memberSince && (
            <p className="text-xs text-black/30 mt-2">Member since {memberSince}</p>
          )}
          {user && !user.isEmailVerified && (
            <p className="text-xs text-amber-600 mt-2 uppercase tracking-wider">
              Email not verified
            </p>
          )}
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveProfile();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email ?? ""}
              readOnly
              className="w-full px-4 py-3 border border-black/10 outline-none bg-black/5 text-black/40 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.15em] hover:bg-black/80 transition disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProfileInfoTab;
