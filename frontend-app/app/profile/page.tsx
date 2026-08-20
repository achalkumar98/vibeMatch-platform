"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addUser } from "@/redux/slices/userSlice";
import { getProfileApi } from "@/api/profileApi";
import EditProfile from "@/components/EditProfile";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  // Rehydrate user from backend if Redux state is empty (e.g. after page refresh)
  useEffect(() => {
    if (!user) {
      getProfileApi()
        .then((u) => dispatch(addUser(u)))
        .catch(() => null);
    }
  }, [user, dispatch]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" style={{ paddingTop: "56px" }}>
        <svg className="animate-spin w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  return <EditProfile user={user} />;
}
