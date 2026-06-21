import { Link } from "react-router-dom";
import { Heart, Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPassword } from "../../services";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => forgotPassword(email),
    onSuccess: () => {
      setSent(true);
      toast.success("Reset link sent.", {
        description: "Check your inbox for the password reset link.",
      });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ?? "Unable to send reset link. Please try again.";
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
              Reset Password
            </h1>
            <p className="text-xs text-black/40 mt-3 tracking-[0.15em] uppercase font-['Times_New_Roman',serif]">
              {sent
                ? "Check your inbox"
                : "We'll send you a reset link"}
            </p>
            <div className="w-12 h-px bg-black/15 mx-auto mt-6" />
          </div>

          {sent ? (
            <div className="text-center space-y-6">
              <p className="text-sm text-black/60 font-light leading-relaxed">
                A password reset link has been sent to{" "}
                <span className="text-black font-normal">{email}</span>. Follow the
                instructions in the email to reset your password.
              </p>
              <p className="text-xs text-black/30">
                Didn't receive it?{" "}
                <button
                  onClick={() => mutate()}
                  disabled={isPending}
                  className="underline hover:text-black/60 transition-colors"
                >
                  Resend
                </button>
              </p>
            </div>
          ) : (
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

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-black text-white py-4 hover:bg-black/80 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-[10px] tracking-[0.2em] uppercase font-['Times_New_Roman',serif]">
                      Sending...
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] tracking-[0.2em] uppercase font-['Times_New_Roman',serif]">
                    Send Reset Link
                  </span>
                )}
              </button>
            </form>
          )}

          <div className="text-center mt-12">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-[9px] tracking-[0.15em] uppercase text-black/30 hover:text-black/60 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Sign In
            </Link>
          </div>

          <div className="flex justify-center mt-12">
            <Heart className="w-3 h-3 text-black/10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
