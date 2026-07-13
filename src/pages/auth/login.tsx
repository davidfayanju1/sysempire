import { Link, useNavigate } from "react-router-dom";
import { Heart, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { authLogin, authGoogleLogin } from "../../services";
import { useAuthStore } from "../../store/authStore";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const { mutate, isPending } = useMutation({
    mutationFn: () => authLogin({ email, password }),
    onSuccess: (res) => {
      const { user, accessToken, refreshToken } = res.data;
      login(user, accessToken, refreshToken);
      toast.success(`Welcome back, ${user.firstName}.`);
      navigate("/profile");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ?? "Sign in failed. Please try again.";
      toast.error(msg);
    },
  });

  const { mutate: mutateGoogle, isPending: isGooglePending } = useMutation({
    mutationFn: (credential: string) => authGoogleLogin(credential),
    onSuccess: (res) => {
      const { user, accessToken, refreshToken } = res.data;
      login(user, accessToken, refreshToken);
      toast.success(`Welcome back, ${user.firstName}.`);
      navigate("/profile");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        "Google sign in failed. Please try again.";
      toast.error(msg);
    },
  });

  return (
    <section className="bg-white min-h-screen flex items-center justify-center">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-24 w-full">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img src="/images/logo_dark.png" alt="" className="h-20" />
            </div>
            <div className="w-12 h-px bg-black/15 mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-light text-black tracking-tight font-['Times_New_Roman',serif]">
              Welcome Back
            </h1>
            <p className="text-xs text-black/40 mt-3 tracking-[0.15em] uppercase font-['Times_New_Roman',serif]">
              Enter your world of style
            </p>
            <div className="w-12 h-px bg-black/15 mx-auto mt-6" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutate();
            }}
          >
            <div className="mb-8">
              <label className="block text-[9px] tracking-[0.2em] uppercase text-black/40 mb-2 font-['Times_New_Roman',serif]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 text-sm text-black border border-black/20 rounded-none outline-none focus:border-black/60 transition-colors font-light placeholder:text-black/20"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] tracking-[0.2em] uppercase text-black/40 mb-2 font-['Times_New_Roman',serif]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-24 py-3 text-sm text-black border border-black/20 rounded-none outline-none focus:border-black/60 transition-colors font-light placeholder:text-black/20"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] tracking-[0.15em] uppercase text-black/30 hover:text-black/60 underline underline-offset-4 transition-colors font-['Times_New_Roman',serif]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="text-right mb-8">
              <Link
                to="/forgot-password"
                className="text-[9px] tracking-[0.15em] uppercase text-black/30 hover:text-black/60 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-black text-white py-4 hover:bg-black/80 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-[10px] tracking-[0.2em] uppercase font-['Times_New_Roman',serif]">
                    Signing In...
                  </span>
                </>
              ) : (
                <span className="text-[10px] tracking-[0.2em] uppercase font-['Times_New_Roman',serif]">
                  Sign In
                </span>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-black/10" />
            <span className="text-[9px] tracking-[0.2em] uppercase text-black/30 font-['Times_New_Roman',serif]">
              Or
            </span>
            <div className="flex-1 h-px bg-black/10" />
          </div>

          <div className="flex justify-center">
            {isGooglePending ? (
              <div className="w-full py-4 flex items-center justify-center gap-2 border border-black/20">
                <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-black/60 font-['Times_New_Roman',serif]">
                  Signing In...
                </span>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (!credentialResponse.credential) {
                    toast.error("Google sign in failed. Please try again.");
                    return;
                  }
                  mutateGoogle(credentialResponse.credential);
                }}
                onError={() => {
                  toast.error("Google sign in failed. Please try again.");
                }}
                theme="outline"
                shape="rectangular"
                size="large"
                width="384"
                text="signin_with"
              />
            )}
          </div>

          <div className="text-center mt-12">
            <p className="text-[9px] tracking-[0.15em] text-black/40 uppercase">
              New to SYS EMPIRE?{" "}
              <Link
                to="/signup"
                className="text-black/70 underline hover:text-black transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>

          <div className="flex justify-center mt-12">
            <Heart className="w-3 h-3 text-black/10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
