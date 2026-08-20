"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { addUser } from "@/redux/slices/userSlice";
import { loginApi } from "@/api/loginApi";
import { BASE_URL } from "@/utils/constants";

export default function LoginPage() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/feed";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await loginApi({ emailId, password });
      dispatch(addUser(user));
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: "github" | "google") => {
    // Redirect to backend OAuth initiation endpoint
    window.location.href = `${BASE_URL}/api/auth/${provider}`;
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#000", paddingTop: "56px" }}
    >
      {/* Left panel — branding + preview */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-12"
        style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div>
          <Link href="/" className="flex items-center gap-2 text-white font-semibold text-sm">
            <span>⚡</span> VibeMatch
          </Link>
        </div>

        {/* Decorative profile stack */}
        <div className="flex flex-col gap-3">
          {[
            { name: "Achal Kumar", role: "Full-Stack Developer", badge: "Premium", dot: "#22c55e" },
            { name: "Priya Sharma", role: "React Engineer", badge: "Online", dot: "#22c55e" },
            { name: "Rahul Verma", role: "Node.js Expert", badge: "New", dot: "#6366f1" },
          ].map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                transform: `translateX(${i * 12}px)`,
                opacity: 1 - i * 0.25,
              }}
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{p.name}</div>
                <div className="text-xs text-white/35 truncate">{p.role}</div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/40 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.dot }} />
                {p.badge}
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-white/25">
          Join thousands of developers connecting on VibeMatch.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-2 text-white font-semibold">
            <span>⚡</span> VibeMatch
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-white/40 mb-8">Sign in to your account to continue</p>

          {/* OAuth buttons */}
          <div className="flex flex-col gap-2.5 mb-6">
            <button
              type="button"
              onClick={() => handleOAuth("github")}
              className="vm-btn vm-btn-ghost w-full py-2.5"
              aria-label="Continue with GitHub"
            >
              <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.997.107-.775.42-1.305.762-1.605-2.665-.3-5.467-1.335-5.467-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 013.003-.403c1.02.005 2.045.138 3.003.403 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.77.84 1.23 1.91 1.23 3.22 0 4.61-2.807 5.625-5.48 5.92.435.375.825 1.11.825 2.237 0 1.616-.015 2.916-.015 3.312 0 .315.21.697.825.577C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>

            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="vm-btn vm-btn-ghost w-full py-2.5"
              aria-label="Continue with Google"
            >
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/25">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Email / password form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">
                Email address
              </label>
              <input
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
                <label className="text-xs text-white/50 font-medium">Password</label>
                <Link href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="vm-btn vm-btn-white w-full py-2.5 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-white/35 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-white hover:underline underline-offset-2">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
