"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/redux/hooks";
import { addUser } from "@/redux/slices/userSlice";
import { editProfileApi } from "@/api/profileApi";
import { uploadPhotoApi } from "@/api/uploadApi";
import type { User } from "@/types";

interface EditProfileProps {
  user: User;
}

export default function EditProfile({ user }: EditProfileProps) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl ?? "");
  const [age, setAge] = useState<number | string>(user.age ?? "");
  const [gender, setGender] = useState(user.gender ?? "");
  const [about, setAbout] = useState(user.about ?? "");
  const [skillsInput, setSkillsInput] = useState((user.skills ?? []).join(", "));
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Upload logic ──────────────────────────────────────────────────────────

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("error", "Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "File must be under 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadPhotoApi(file);
      setPhotoUrl(url);
      showToast("success", "Photo uploaded successfully.");
    } catch {
      showToast("error", "Upload failed. Check your Cloudinary config.");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  // ── Save ─────────────────────────────────────────────────────────────────

  const saveProfile = async () => {
    setError("");
    if (!firstName || !age || !gender) {
      setError("First name, age, and gender are required.");
      return;
    }
    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      const updated = await editProfileApi({
        firstName,
        lastName,
        photoUrl: photoUrl || undefined,
        age: Number(age),
        gender,
        about,
        skills,
      });
      dispatch(addUser(updated));
      showToast("success", "Profile saved successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    }
  };

  const previewUrl = photoUrl || "https://www.gravatar.com/avatar?d=mp";

  return (
    <div className="min-h-screen bg-black" style={{ paddingTop: "56px" }}>
      <div className="max-w-4xl mx-auto px-5 py-10">
        <h1 className="text-2xl font-bold text-white mb-8">Edit Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: photo upload ────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-4">
            {/* Avatar preview */}
            <div className="w-32 h-32 rounded-full overflow-hidden relative ring-2 ring-white/10">
              <Image
                src={previewUrl}
                alt="Profile photo"
                fill
                className="object-cover"
                sizes="128px"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Drag-and-drop zone */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className="w-full rounded-xl p-4 text-center cursor-pointer transition-colors"
              style={{
                border: `2px dashed ${dragOver ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)"}`,
                background: dragOver ? "rgba(255,255,255,0.05)" : "transparent",
              }}
              aria-label="Upload profile photo"
            >
              <p className="text-xs text-white/40">
                {uploading ? "Uploading…" : "Drag & drop or click to upload"}
              </p>
              <p className="text-xs text-white/20 mt-1">JPG, PNG, WebP · max 5 MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* OR paste URL */}
            <div className="w-full">
              <label className="text-xs text-white/40 block mb-1.5">Or paste image URL</label>
              <input
                type="url"
                className="vm-input text-sm"
                placeholder="https://…"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>
          </div>

          {/* ── Right: form ───────────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 block mb-1.5 font-medium">
                  First name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="vm-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1.5 font-medium">Last name</label>
                <input
                  type="text"
                  className="vm-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 block mb-1.5 font-medium">
                  Age <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  className="vm-input"
                  min={18}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1.5 font-medium">
                  Gender <span className="text-red-400">*</span>
                </label>
                <select
                  className="vm-input"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 block mb-1.5 font-medium">About</label>
              <textarea
                className="vm-input resize-none"
                rows={4}
                placeholder="Tell other developers about yourself…"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-white/50 block mb-1.5 font-medium">
                Skills <span className="text-white/25 font-normal">(comma-separated)</span>
              </label>
              <input
                type="text"
                className="vm-input"
                placeholder="React, Node.js, TypeScript…"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
              />
              {/* Tags preview */}
              {skillsInput && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {skillsInput.split(",").map((s) => s.trim()).filter(Boolean).map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 rounded-full text-xs text-white/60"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-sm px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={saveProfile}
              className="vm-btn vm-btn-white py-2.5 self-start px-8"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
          <div
            className="px-4 py-3 rounded-xl text-sm font-medium shadow-lg"
            style={{
              background: toast.type === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
              border: `1px solid ${toast.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
              color: toast.type === "success" ? "#86efac" : "#fca5a5",
            }}
          >
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
