"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, Github, Loader2, Zap, ArrowRight, Check } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { addUser } from "@/redux/slices/userSlice";
import { signupApi } from "@/api/signupApi";
import { BASE_URL } from "@/utils/constants";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

const PERKS = [
  "Swipe through developer profiles",
  "Real-time chat with Socket.IO",
  "Cloudinary-powered photo uploads",
  "Premium plans via Razorpay",
];

export default function SignUpPage() {
  const [firstName,    setFirstName]    = useState("");
  const [lastName,     setLastName]     = useState("");
  const [emailId,      setEmailId]      = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);

  const dispatch = useAppDispatch();
  const router   = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const id = toast.loading("Creating your account…");
    try {
      const user = await signupApi({ firstName, lastName, emailId, password });
      dispatch(addUser(user));
      toast.success("Account created! Set up your profile.", { id });
      router.push("/profile");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed. Please try again.";
      setError(msg);
      toast.error(msg, { id });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: "github" | "google") => {
    window.location.href = `${BASE_URL}/api/auth/${provider}`;
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--bg-base)", paddingTop: "56px" }}
    >
      {/* ── Left panel ──────────────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col justify-between w-[44%] p-12 shrink-0"
        style={{ borderRight: "1px solid var(--border)" }}
        aria-hidden
      >
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-brand-500" strokeWidth={2.2} />
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>VibeMatch</span>
        </div>

        <div>
          <h2
            className="font-bold tracking-tight leading-snug mb-8"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--text-primary)" }}
          >
            The developer<br />networking platform.
          </h2>
          <ul className="flex flex-col gap-3">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "var(--success-bg)", color: "var(--success)" }}
                >
                  <Check size={12} strokeWidth={2.5} aria-hidden />
                </span>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Free to join. No credit card required.
        </p>
      </aside>

      {/* ── Form panel ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[340px]">

          <div className="lg:hidden flex items-center gap-1.5 mb-8">
            <Zap size={16} className="text-brand-500" strokeWidth={2.2} aria-hidden />
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>VibeMatch</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: "var(--text-primary)" }}>
            Create your account
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            Start connecting with developers worldwide
          </p>

          {/* OAuth */}
          <div className="flex flex-col gap-2.5 mb-6">
            <button
              type="button"
              onClick={() => handleOAuth("github")}
              className="vm-btn vm-btn-ghost w-full py-2.5"
              aria-label="Sign up with GitHub"
            >
              <Github size={15} strokeWidth={1.8} aria-hidden />
              Continue with GitHub
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="vm-btn vm-btn-ghost w-full py-2.5"
              aria-label="Sign up with Google"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ color: "var(--text-disabled)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          <form onSubmit={handleSignUp} className="flex flex-col gap-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="vm-input"
                  placeholder="Achal"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="vm-input"
                  placeholder="Kumar"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="emailSignup" className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Email address
              </label>
              <input
                id="emailSignup"
                type="email"
                className="vm-input"
                placeholder="you@example.com"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="passwordSignup" className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="passwordSignup"
                  type={showPassword ? "text" : "password"}
                  className="vm-input pr-10"
                  placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword
                    ? <EyeOff size={15} strokeWidth={1.8} aria-hidden />
                    : <Eye    size={15} strokeWidth={1.8} aria-hidden />
                  }
                </button>
              </div>
            </div>

            {error && (
              <p
                className="text-sm px-3 py-2 rounded-lg"
                style={{ color: "var(--error)", background: "var(--error-bg)", border: "1px solid var(--error)" }}
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="vm-btn vm-btn-solid w-full py-2.5 mt-1"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" aria-hidden />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={14} strokeWidth={2} aria-hidden />
                </>
              )}
            </button>

            <p className="text-xs text-center" style={{ color: "var(--text-disabled)" }}>
              By signing up you agree to our{" "}
              <Link href="#" style={{ color: "var(--text-muted)" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}>Terms</Link>
              {" & "}
              <Link href="#" style={{ color: "var(--text-muted)" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}>Privacy</Link>
            </p>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium transition-colors"
              style={{ color: "var(--text-primary)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
