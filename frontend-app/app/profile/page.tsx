"use client";

import { useAppSelector } from "@/redux/hooks";
import EditProfile from "@/components/EditProfile";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.user);

  if (!user) {
    return (
      <p className="text-center text-gray-400 my-10">Loading profile...</p>
    );
  }

  return <EditProfile user={user} />;
}
