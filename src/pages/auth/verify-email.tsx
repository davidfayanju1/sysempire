import { Link, useSearchParams } from "react-router-dom";
import { Heart, CheckCircle, XCircle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyEmail, resendVerification } from "../../services";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    token ? "verifying" : "error",
  );

  const { mutate: verify } = useMutation({
    mutationFn: () => verifyEmail(token),
    onSuccess: () => {
      setStatus("success");
      toast.success("Email verified.", {
        description: "Your account is now active.",
      });
    },
    onError: (err: any) => {
      setStatus("error");
      const msg =
        err?.response?.data?.message ?? "Verification failed. The link may have expired.";
      toast.error(msg);
    },
  });

  const { mutate: resend, isPending: resending } = useMutation({
    mutationFn: resendVerification,
    onSuccess: () => {
      toast.success("Verification email resent.", {
        description: "Check your inbox.",
      });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ?? "Could not resend. Please try again.";
      toast.error(msg);
    },
  });

  useEffect(() => {
    if (token) verify();
  }, []);

  return (
    <section className="bg-white min-h-screen flex items-center justify-center">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-24 w-full">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img src="/images/logo_dark.png" alt="" className="h-20" />
          </div>
          <div className="w-12 h-px bg-black/15 mx-auto mb-6" />

          {status === "verifying" && (
            <>
              <div className="flex justify-center mb-6">
                <Loader className="w-8 h-8 text-black/30 animate-spin" />
              </div>
              <h1 className="text-2xl font-light text-black tracking-tight font-['Times_New_Roman',serif] mb-3">
                Verifying your email...
              </h1>
              <p className="text-xs text-black/40 tracking-[0.1em]">
                Please wait a moment.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-light text-black tracking-tight font-['Times_New_Roman',serif] mb-3">
                Email Verified
              </h1>
              <p className="text-sm text-black/50 font-light mb-8">
                Your account is now active. You can sign in and start exploring
                the empire.
              </p>
              <Link
                to="/login"
                className="inline-block bg-black text-white px-10 py-4 text-[10px] tracking-[0.2em] uppercase font-['Times_New_Roman',serif] hover:bg-black/80 transition-colors"
              >
                Sign In
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center mb-6">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-light text-black tracking-tight font-['Times_New_Roman',serif] mb-3">
                Verification Failed
              </h1>
              <p className="text-sm text-black/50 font-light mb-8">
                {token
                  ? "This verification link is invalid or has expired."
                  : "No verification token found. Check that you used the correct link from your email."}
              </p>
              <button
                onClick={() => resend()}
                disabled={resending}
                className="w-full bg-black text-white py-4 hover:bg-black/80 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
              >
                {resending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-[10px] tracking-[0.2em] uppercase font-['Times_New_Roman',serif]">
                      Sending...
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] tracking-[0.2em] uppercase font-['Times_New_Roman',serif]">
                    Resend Verification Email
                  </span>
                )}
              </button>
              <Link
                to="/login"
                className="block text-[9px] tracking-[0.15em] uppercase text-black/30 hover:text-black/60 transition-colors"
              >
                Back to Sign In
              </Link>
            </>
          )}

          <div className="flex justify-center mt-12">
            <Heart className="w-3 h-3 text-black/10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;
