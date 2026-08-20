"use client";

import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { addUser } from "@/redux/slices/userSlice";
import { editProfileApi } from "@/api/profileApi";
import UserCard from "./UserCard";
import type { User } from "@/types";

interface EditProfileProps {
  user: User;
}

export default function EditProfile({ user }: EditProfileProps) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl ?? "");
  const [age, setAge] = useState<number | string>(user.age ?? "");
  const [gender, setGender] = useState(user.gender ?? "");
  const [about, setAbout] = useState(user.about ?? "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const dispatch = useAppDispatch();

  const saveProfile = async () => {
    setError("");
    if (!firstName || !lastName || !age || !gender) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      const updated = await editProfileApi({
        firstName,
        lastName,
        photoUrl,
        age,
        gender,
        about,
      });
      dispatch(addUser(updated));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    }
  };

  // Preview object for UserCard (no _id required for editable preview)
  const previewUser = {
    _id: user._id,
    firstName,
    lastName,
    photoUrl: photoUrl || undefined,
    age: Number(age) || undefined,
    gender: gender || undefined,
    about: about || undefined,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto my-10 p-4 sm:p-6">
      {/* Form */}
      <div className="w-full bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700">
        <h2 className="text-2xl font-semibold text-center mb-6 text-white">
          Edit Profile
        </h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-200">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full bg-gray-800 text-white border-gray-700"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-200">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full bg-gray-800 text-white border-gray-700"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label className="block mb-1 font-medium text-gray-200">
              Photo URL
            </label>
            <input
              type="text"
              className="input input-bordered w-full bg-gray-800 text-white border-gray-700"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-200">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full bg-gray-800 text-white border-gray-700"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-200">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                className="select select-bordered w-full bg-gray-800 text-white border-gray-700"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">male</option>
                <option value="female">female</option>
                <option value="other">other</option>
              </select>
            </div>
          </div>

          {/* About */}
          <div>
            <label className="block mb-1 font-medium text-gray-200">
              About
            </label>
            <textarea
              className="textarea textarea-bordered w-full bg-gray-800 text-white border-gray-700"
              rows={4}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            className="btn btn-primary w-full mt-4"
            type="button"
            onClick={saveProfile}
          >
            Save Profile
          </button>
        </form>
      </div>

      {/* Live preview */}
      <div className="w-full flex justify-center items-start">
        <UserCard user={previewUser} editable />
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
          <div className="alert alert-success shadow-lg">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </div>
  );
}
