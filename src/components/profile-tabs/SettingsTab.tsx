import { motion } from "framer-motion";
import { LogOut, Lock } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { updatePassword, authLogout } from "../../services";
import { useAuthStore } from "../../store/authStore";

const SettingsTab = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const { mutate: changePassword, isPending: changingPassword } = useMutation({
    mutationFn: () => updatePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      toast.success("Password updated.", {
        description: "Please use your new password next time you sign in.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNew("");
      setShowChangePassword(false);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? "Could not update password.";
      toast.error(msg);
    },
  });

  const { mutate: signOut, isPending: signingOut } = useMutation({
    mutationFn: authLogout,
    onSettled: () => {
      logout();
      toast.success("Signed out.");
      navigate("/");
    },
  });

  const handlePasswordSubmit = () => {
    if (newPassword !== confirmNew) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    changePassword();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* Notifications */}
      <div>
        <h3 className="text-sm uppercase tracking-[0.2em] text-black/50 mb-5">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-black/70 text-sm">Email notifications for orders</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 border-black/30 focus:ring-0 focus:ring-offset-0" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-black/70 text-sm">Promotional emails</span>
            <input type="checkbox" className="w-4 h-4 border-black/30 focus:ring-0 focus:ring-offset-0" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-black/70 text-sm">SMS updates for deliveries</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 border-black/30 focus:ring-0 focus:ring-offset-0" />
          </label>
        </div>
      </div>

      {/* Password */}
      <div className="pt-5 border-t border-black/10">
        <h3 className="text-sm uppercase tracking-[0.2em] text-black/50 mb-5">
          Privacy & Security
        </h3>

        {!showChangePassword ? (
          <button
            onClick={() => setShowChangePassword(true)}
            className="flex items-center gap-2 text-sm text-black/60 hover:text-black transition"
          >
            <Lock className="w-4 h-4" />
            Change Password
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordSubmit();
            }}
            className="space-y-4 max-w-sm"
          >
            <div>
              <label className="block text-[9px] uppercase tracking-[0.2em] text-black/40 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-[0.2em] text-black/40 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white text-sm"
                placeholder="Min. 8 characters"
                required
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-[0.2em] text-black/40 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmNew}
                onChange={(e) => setConfirmNew(e.target.value)}
                className="w-full px-4 py-3 border border-black/20 focus:border-black outline-none transition bg-white text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                className="px-6 py-3 border border-black/20 text-black/60 text-xs uppercase tracking-wider hover:border-black/40 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={changingPassword}
                className="px-6 py-3 bg-black text-white text-xs uppercase tracking-wider hover:bg-black/80 transition disabled:opacity-50 flex items-center gap-2"
              >
                {changingPassword && (
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Sign Out */}
      <div className="pt-5 border-t border-black/10">
        <button
          onClick={() => signOut()}
          disabled={signingOut}
          className="flex items-center gap-2 text-sm text-black/50 hover:text-black transition disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
          <span>{signingOut ? "Signing out..." : "Sign Out"}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default SettingsTab;
