import { create } from "zustand";
import { persist } from "zustand/middleware";

// No backend endpoint for saved addresses yet — stored client-side as part of
// the persisted user object (see `partialize` below) until one exists.
export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface AuthUser {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  avatar?: string;
  addresses?: Address[];
}

interface AuthStore {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  login: (user: AuthUser, accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, updates: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      login: (user, accessToken, refreshToken) => {
        localStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("accessToken", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
          sessionStorage.setItem("refreshToken", refreshToken);
        }
        set({ user });
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("refreshToken");
        set({ user: null });
      },

      addAddress: (address) =>
        set((state) => {
          if (!state.user) return state;
          const existing = state.user.addresses ?? [];
          const makeDefault = address.isDefault || existing.length === 0;
          const addresses: Address[] = [
            ...existing.map((a) =>
              makeDefault ? { ...a, isDefault: false } : a,
            ),
            { ...address, id: crypto.randomUUID(), isDefault: makeDefault },
          ];
          return { user: { ...state.user, addresses } };
        }),

      updateAddress: (id, updates) =>
        set((state) => {
          if (!state.user) return state;
          const existing = state.user.addresses ?? [];
          const makeDefault = updates.isDefault;
          const addresses = existing.map((a) => {
            if (a.id === id) return { ...a, ...updates, id };
            return makeDefault ? { ...a, isDefault: false } : a;
          });
          return { user: { ...state.user, addresses } };
        }),

      removeAddress: (id) =>
        set((state) => {
          if (!state.user) return state;
          const remaining = (state.user.addresses ?? []).filter(
            (a) => a.id !== id,
          );
          if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
            remaining[0] = { ...remaining[0], isDefault: true };
          }
          return { user: { ...state.user, addresses: remaining } };
        }),

      setDefaultAddress: (id) =>
        set((state) => {
          if (!state.user) return state;
          const addresses = (state.user.addresses ?? []).map((a) => ({
            ...a,
            isDefault: a.id === id,
          }));
          return { user: { ...state.user, addresses } };
        }),
    }),
    {
      name: "sysempire-auth",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
