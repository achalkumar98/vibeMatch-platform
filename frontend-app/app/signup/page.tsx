"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch } from "@/redux/hooks";
import { addUser } from "@/redux/slices/userSlice";
import { signupApi } from "@/api/signupApi";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSignUp = async () => {
    setError("");
    try {
      const user = await signupApi({ firstName, lastName, emailId, password });
      dispatch(addUser(user));
      router.push("/profile");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Signup failed. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col lg:flex-row w-full max-w-3xl bg-gray-900/95 shadow-2xl rounded-2xl overflow-hidden border border-gray-800 transition-transform hover:scale-[1.01] duration-300">

        {/* Left image */}
        <div className="hidden lg:block lg:w-1/2 relative min-h-[400px]">
          <Image
            src="https://images.pexels.com/photos/33647014/pexels-photo-33647014.jpeg"
            alt="Signup Banner"
            fill
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-2xl font-bold text-center px-4">
            Join Us Today 🚀
          </div>
        </div>

        {/* Form */}
        <div className="w-full lg:w-1/2 px-6 py-10 sm:px-10 sm:py-12 text-gray-100">
          <h2 className="text-3xl font-extrabold text-center mb-6 text-white">
            Create Your Account
          </h2>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="button"
              onClick={handleSignUp}
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
