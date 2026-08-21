"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Eye, EyeOff, Github, Loader2, ArrowRight, Check,
} from "lucide-react";
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
  { text: "Swipe through developer profiles", color: "#f59e0b" },
  { text: "Real-time 1:1 chat with Socket.IO", color: "#6366f1" },
  { text: "Cloudinary-powered photo uploads",  color: "#22c55e" },
  { text: "Premium plans via Razorpay",         color: "#8b5cf6" },
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
      style={{ background: "var(--bg-base)", paddingTop: "60px" }}
    >
      {/* ── Left panel ──────────────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col justify-between w-[46%] px-12 py-14 flex-shrink-0 relative overflow-hidden"
        style={{ borderRight: "1px solid var(--border)" }}
        aria-hidden
      >
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 80% 40%, var(--brand-subtle) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 vm-animate-fade-in">
          <Image
            src="/assets/vibeMatch-logo.png"
            alt="VibeMatch"
            width={44}
            height={44}
            className="vm-logo-img rounded-xl"
            style={{ width: 44, height: 44 }}
          />
          <div>
            <p
              className="font-bold tracking-tight"
              style={{ fontSize: "18px", letterSpacing: "-0.03em", color: "var(--text-primary)" }}
            >
              VibeMatch
            </p>
            <div className="vm-snake-badge--green vm-snake-badge mt-0.5" style={{ fontSize: "9px", padding: "1px 8px" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Free to join
            </div>
          </div>
        </div>

        {/* Headline + perks */}
        <div className="relative z-10">
          <h2
            className="font-bold tracking-tight leading-[1.1] mb-6 vm-animate-fade-up"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: "var(--text-primary)" }}
          >
            The developer
            <br />
            <span className="vm-gradient-text">networking platform.</span>
          </h2>

          <ul className="flex flex-col gap-3.5">
            {PERKS.map(({ text, color }, i) => (
              <li
                key={text}
                className={`flex items-center gap-3 vm-animate-slide-right vm-delay-${(i + 1) * 100}`}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}1a`, border: `1px solid ${color}40` }}
                >
                  <Check size={11} style={{ color }} strokeWidth={2.5} aria-hidden />
                </span>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p
          className="relative z-10 text-xs vm-animate-fade-in vm-delay-600"
          style={{ color: "var(--text-disabled)" }}
        >
          No credit card required · Cancel anytime
        </p>
      </aside>

      {/* ── Form panel ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[340px] vm-animate-scale-up">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <Image
              src="/assets/vibeMatch-logo.png"
              alt="VibeMatch"
              width={32}
              height={32}
              className="vm-logo-img rounded-lg"
              style={{ width: 32, height: 32 }}
            />
            <span
              className="font-bold"
              style={{ fontSize: "15px", letterSpacing: "-0.02em", color: "var(--text-primary)" }}
            >
              VibeMatch
            </span>
          </div>

          {/* Page badge */}
          <div className="vm-snake-badge vm-snake-badge--green mb-5" style={{ fontSize: "10px" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden />
            Join for free
          </div>

          <h1
            className="font-bold tracking-tight mb-1"
            style={{ fontSize: "1.55rem", letterSpacing: "-0.03em", color: "var(--text-primary)" }}
          >
            Create your account
          </h1>
          <p className="text-sm mb-7" style={{ color: "var(--text-muted)" }}>
            Start connecting with developers worldwide
          </p>

          {/* OAuth */}
          <div className="flex flex-col gap-2.5 mb-6">
            <button
              type="button"
              onClick={() => handleOAuth("github")}
              className="vm-btn vm-btn-ghost w-full py-2.5 text-sm"
              aria-label="Sign up with GitHub"
            >
              <Github size={15} strokeWidth={1.8} aria-hidden />
              Continue with GitHub
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="vm-btn vm-btn-ghost w-full py-2.5 text-sm"
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
                  placeholder="Min 8 chars, uppercase, symbol"
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
                    : <Eye    size={15} strokeWidth={1.8} aria-hidden />}
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
              className="vm-btn vm-btn-solid w-full py-2.5 mt-1 vm-btn-glow"
            >
              {loading ? (
                <><Loader2 size={14} className="animate-spin" aria-hidden /> Creating account…</>
              ) : (
                <>Create account <ArrowRight size={14} strokeWidth={2} aria-hidden /></>
              )}
            </button>

            <p className="text-xs text-center" style={{ color: "var(--text-disabled)" }}>
              By signing up you agree to our{" "}
              <Link
                href="#"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
              >
                Terms
              </Link>
              {" & "}
              <Link
                href="#"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
              >
                Privacy
              </Link>
            </p>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold transition-colors"
              style={{ color: "var(--brand)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--brand-hover)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
