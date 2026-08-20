"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addFeed } from "@/redux/slices/feedSlice";
import { getFeedApi } from "@/api/feedApi";
import UserCard from "@/components/UserCard";

export default function FeedPage() {
  const feed = useAppSelector((state) => state.feed);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (feed && feed.length > 0) return;
    (async () => {
      try {
        const data = await getFeedApi();
        dispatch(addFeed(data));
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to fetch feed";
        setError(msg);
      }
    })();
  }, []);

  if (error) {
    return (
      <p className="flex justify-center my-10 text-red-500 text-lg font-semibold">
        {error}
      </p>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <p className="flex justify-center my-10 text-gray-100 text-lg font-medium">
        No New Users Found
      </p>
    );
  }

  return (
    <div className="relative flex justify-center items-center my-10 px-4 sm:px-6 md:px-8 h-[70vh] sm:h-[60vh]">
      {[...feed].reverse().map((user, index) => (
        <UserCard key={user._id} user={user} zIndex={index + 1} />
      ))}
    </div>
  );
}
