"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Eye, EyeOff, Github, Loader2, ArrowRight,
  Zap, MessageSquare, Users, Shield,
} from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { addUser } from "@/redux/slices/userSlice";
import { loginApi } from "@/api/loginApi";
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

const VM_FEATURES = [
  {
    Icon: Zap,
    label: "Swipe to Connect",
    desc:  "Discover developers by swiping through intelligent feed cards.",
    color: "#f59e0b",
    badge: { text: "Infinite Scroll", cls: "vm-snake-badge--amber" },
  },
  {
    Icon: MessageSquare,
    label: "Real-time Chat",
    desc:  "1:1 Socket.IO messaging with online presence & last-seen.",
    color: "#6366f1",
    badge: { text: "Live", cls: "vm-snake-badge--purple" },
  },
  {
    Icon: Users,
    label: "Connection Network",
    desc:  "Build your developer network with accepted connections.",
    color: "#22c55e",
    badge: { text: "New", cls: "vm-snake-badge--green" },
  },
  {
    Icon: Shield,
    label: "Premium Plans",
    desc:  "Silver, Gold, Diamond — unlock priority placement & more.",
    color: "#8b5cf6",
    badge: { text: "Hot", cls: "vm-snake-badge--pink" },
  },
];

function LoginForm() {
  const [emailId,      setEmailId]      = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);

  const dispatch     = useAppDispatch();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get("redirect") || "/feed";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const id = toast.loading("Signing in…");
    try {
      const user = await loginApi({ emailId, password });
      dispatch(addUser(user));
      toast.success("Welcome back!", { id });
      router.push(redirectTo);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed. Please try again.";
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

      {/* ── Left panel — VibeMatch content ──────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col justify-between w-[46%] px-12 py-14 flex-shrink-0 overflow-hidden relative"
        style={{ borderRight: "1px solid var(--border)" }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 20% 50%, var(--brand-subtle) 0%, transparent 70%)",
          }}
          aria-hidden
        />

        {/* Logo + brand */}
        <div className="relative z-10 flex items-center gap-3 vm-animate-fade-in">
          <Image
            src="/assets/vibeMatch-logo.png"
            alt="VibeMatch"
            width={40}
            height={40}
            className="vm-logo-img rounded-xl"
            style={{ width: 40, height: 40 }}
          />
          <div>
            <p
              className="font-bold tracking-tight"
              style={{ fontSize: "17px", letterSpacing: "-0.03em", color: "var(--text-primary)" }}
            >
              VibeMatch
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Developer networking
            </p>
          </div>
        </div>

        {/* Feature list */}
        <div className="relative z-10 flex flex-col gap-5">
          <div className="mb-2 vm-animate-fade-up">
            <div className="vm-snake-badge mb-4" aria-label="Live platform">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden />
              Platform live — v2.0
            </div>
            <h2
              className="font-bold tracking-tight leading-[1.1]"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: "var(--text-primary)" }}
            >
              Where developers
              <br />
              <span className="vm-gradient-text">find their vibe.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Swipe. Connect. Build — with developers who share your stack.
            </p>
          </div>

          <ul className="flex flex-col gap-3.5">
            {VM_FEATURES.map(({ Icon, label, desc, color, badge }, i) => (
              <li
                key={label}
                className={`flex items-start gap-3 vm-animate-fade-up vm-delay-${(i + 1) * 100}`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${color}1a`, border: `1px solid ${color}30` }}
                  aria-hidden
                >
                  <Icon size={15} style={{ color }} strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {label}
                    </span>
                    <span className={`vm-snake-badge ${badge.cls} text-2xs`} style={{ fontSize: "9px", padding: "1px 7px" }}>
                      {badge.text}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p
          className="relative z-10 text-xs vm-animate-fade-in vm-delay-600"
          style={{ color: "var(--text-disabled)" }}
        >
          Free to join · No credit card required
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
          <div className="vm-snake-badge--cyan vm-snake-badge mb-5" style={{ fontSize: "10px" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" aria-hidden />
            Secure sign-in
          </div>

          <h1
            className="font-bold tracking-tight mb-1"
            style={{ fontSize: "1.55rem", letterSpacing: "-0.03em", color: "var(--text-primary)" }}
          >
            Welcome back
          </h1>
          <p className="text-sm mb-7" style={{ color: "var(--text-muted)" }}>
            Sign in to continue to your developer network
          </p>

          {/* OAuth */}
          <div className="flex flex-col gap-2.5 mb-6">
            <button
              type="button"
              onClick={() => handleOAuth("github")}
              className="vm-btn vm-btn-ghost w-full py-2.5 text-sm"
              aria-label="Continue with GitHub"
            >
              <Github size={15} strokeWidth={1.8} aria-hidden />
              Continue with GitHub
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="vm-btn vm-btn-ghost w-full py-2.5 text-sm"
              aria-label="Continue with Google"
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

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Email address
              </label>
              <input
                id="email"
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
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="vm-input pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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
                <><Loader2 size={14} className="animate-spin" aria-hidden /> Signing in…</>
              ) : (
                <>Sign in <ArrowRight size={14} strokeWidth={2} aria-hidden /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold transition-colors"
              style={{ color: "var(--brand)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--brand-hover)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
