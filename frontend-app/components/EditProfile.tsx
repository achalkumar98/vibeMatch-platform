"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Upload, Loader2, X, AlertCircle, User, Camera } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { addUser } from "@/redux/slices/userSlice";
import { editProfileApi } from "@/api/profileApi";
import { uploadPhotoApi } from "@/api/uploadApi";
import type { User as UserType } from "@/types";

interface EditProfileProps { user: UserType; }

export default function EditProfile({ user }: EditProfileProps) {
  const [firstName,   setFirstName]   = useState(user.firstName);
  const [lastName,    setLastName]    = useState(user.lastName ?? "");
  const [photoUrl,    setPhotoUrl]    = useState(user.photoUrl ?? "");
  const [age,         setAge]         = useState<number | string>(user.age ?? "");
  const [gender,      setGender]      = useState(user.gender ?? "");
  const [about,       setAbout]       = useState(user.about ?? "");
  const [skillsInput, setSkillsInput] = useState((user.skills ?? []).join(", "));
  const [error,       setError]       = useState("");
  const [uploading,   setUploading]   = useState(false);
  const [dragOver,    setDragOver]    = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch     = useAppDispatch();

  /* Generate deterministic avatar fallback (DiceBear) */
  const avatarSrc = photoUrl ||
    `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(user.firstName + user.lastName)}`;

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Only image files are allowed."); return; }
    if (file.size > 5 * 1024 * 1024)    { toast.error("File must be under 5 MB."); return; }
    setUploading(true);
    const id = toast.loading("Uploading photo…");
    try {
      const url = await uploadPhotoApi(file);
      setPhotoUrl(url);
      toast.success("Photo uploaded and optimised.", { id });
    } catch {
      toast.error("Upload failed. Check your Cloudinary config.", { id });
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const saveProfile = async () => {
    setError("");
    if (!firstName || !age || !gender) {
      setError("First name, age, and gender are required.");
      return;
    }
    const skills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
    const id = toast.loading("Saving profile…");
    try {
      const updated = await editProfileApi({
        firstName, lastName,
        photoUrl: photoUrl || undefined,
        age: Number(age), gender, about, skills,
      });
      dispatch(addUser(updated));
      toast.success("Profile saved!", { id });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      toast.error(msg, { id });
    }
  };

  const skillTags = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Page header ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8 vm-animate-fade-up">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--brand-subtle)", color: "var(--brand)" }}
            aria-hidden
          >
            <User size={17} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="page-title">Edit Profile</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Update your developer profile
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Photo column — avatar only ────────────────────────────── */}
          <div className="flex flex-col items-center gap-5 vm-animate-fade-up vm-delay-100">

            {/* Avatar with camera overlay */}
            <div className="relative group">
              <div
                className="w-36 h-36 rounded-full overflow-hidden"
                style={{ border: "3px solid var(--border-strong)" }}
              >
                <Image
                  src={avatarSrc}
                  alt="Your profile photo"
                  fill={false}
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                  sizes="144px"
                />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full" style={{ background: "rgba(0,0,0,0.55)" }}>
                    <Loader2 size={28} className="animate-spin text-white" aria-label="Uploading…" />
                  </div>
                )}
              </div>

              {/* Camera button overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
                style={{
                  background: "var(--brand)",
                  border:     "2px solid var(--bg-base)",
                  color:      "#fff",
                }}
                aria-label="Upload new profile photo"
              >
                <Camera size={14} strokeWidth={2} aria-hidden />
              </button>
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
              className="w-full rounded-2xl p-5 text-center cursor-pointer transition-all"
              style={{
                border:     `2px dashed ${dragOver ? "var(--brand)" : "var(--border-strong)"}`,
                background: dragOver ? "var(--brand-subtle)" : "var(--bg-overlay)",
              }}
              aria-label="Drag and drop or click to upload a photo"
            >
              <Upload
                size={20}
                className="mx-auto mb-2.5"
                style={{ color: dragOver ? "var(--brand)" : "var(--text-muted)" }}
                aria-hidden
              />
              <p className="text-xs font-medium" style={{ color: dragOver ? "var(--brand)" : "var(--text-secondary)" }}>
                {uploading ? "Uploading…" : "Drag & drop or click to upload"}
              </p>
              <p className="text-2xs mt-1" style={{ color: "var(--text-disabled)" }}>
                JPG · PNG · WebP · max 5 MB
              </p>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
              aria-label="Upload photo"
            />

            {/* Remove photo */}
            {photoUrl && (
              <button
                type="button"
                onClick={() => setPhotoUrl("")}
                className="vm-btn vm-btn-ghost text-xs px-4 py-1.5 w-full"
              >
                <X size={12} strokeWidth={2} aria-hidden />
                Remove photo
              </button>
            )}

            {/* Avatar hint */}
            {!photoUrl && (
              <p className="text-2xs text-center" style={{ color: "var(--text-disabled)" }}>
                Auto-avatar generated from your name until you upload a photo.
              </p>
            )}
          </div>

          {/* ── Form ──────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-4 vm-animate-fade-up vm-delay-200">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ep-firstName" className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  First name <span style={{ color: "var(--error)" }}>*</span>
                </label>
                <input id="ep-firstName" type="text" className="vm-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="ep-lastName" className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Last name
                </label>
                <input id="ep-lastName" type="text" className="vm-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ep-age" className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Age <span style={{ color: "var(--error)" }}>*</span>
                </label>
                <input id="ep-age" type="number" className="vm-input" min={18} value={age} onChange={(e) => setAge(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="ep-gender" className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Gender <span style={{ color: "var(--error)" }}>*</span>
                </label>
                <select id="ep-gender" className="vm-input" value={gender} onChange={(e) => setGender(e.target.value)} required>
                  <option value="">Select…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="ep-about" className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
                About
              </label>
              <textarea
                id="ep-about"
                className="vm-input resize-none"
                rows={4}
                placeholder="Tell other developers about yourself, your stack, and what you're building…"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="ep-skills" className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Skills{" "}
                <span className="font-normal" style={{ color: "var(--text-disabled)" }}>(comma-separated)</span>
              </label>
              <input
                id="ep-skills"
                type="text"
                className="vm-input"
                placeholder="React, Node.js, TypeScript, MongoDB…"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
              />
              {skillTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5" role="list" aria-label="Skill tags">
                  {skillTags.map((s) => (
                    <span key={s} role="listitem" className="vm-badge vm-badge-muted text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <p
                className="text-sm px-3 py-2 rounded-lg flex items-center gap-2"
                style={{ color: "var(--error)", background: "var(--error-bg)", border: "1px solid var(--error)" }}
                role="alert"
              >
                <AlertCircle size={14} strokeWidth={2} aria-hidden />
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={saveProfile}
              className="vm-btn vm-btn-primary py-2.5 self-start px-8"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
