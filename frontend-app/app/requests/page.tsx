"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addRequests, removeRequest } from "@/redux/slices/requestSlice";
import { getReceivedRequestsApi } from "@/api/connectionApi";
import { reviewRequestApi } from "@/api/requestApi";

export default function RequestsPage() {
  const requests = useAppSelector((state) => state.requests);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getReceivedRequestsApi();
        dispatch(addRequests(data));
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleReview = async (
    status: "accepted" | "rejected",
    requestId: string
  ) => {
    try {
      await reviewRequestApi(status, requestId);
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error("Error reviewing request:", err);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-100 text-lg my-10">
        Loading requests...
      </p>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <h1 className="flex justify-center text-gray-100 text-lg my-10">
        No Requests Found
      </h1>
    );
  }

  return (
    <div className="text-center my-10 px-4 sm:px-6 md:px-8">
      <h1 className="font-bold text-white text-3xl mb-6">
        Connection Requests
      </h1>
      <div className="flex flex-col gap-6">
        {requests.map((request) => {
          const { _id, fromUserId } = request;
          const { firstName, lastName, photoUrl, age, gender, about } =
            fromUserId;

          return (
            <div
              key={_id}
              className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl bg-gray-800 text-white border border-gray-700 shadow-md transition-transform hover:scale-105 hover:bg-gray-700 w-full md:w-2/3 lg:w-1/2 mx-auto"
            >
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={photoUrl || "https://www.gravatar.com/avatar?d=mp"}
                  alt={`${firstName}'s profile`}
                  fill
                  className="object-cover rounded-full border border-gray-600"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-xl font-semibold">
                  {firstName} {lastName}
                </h2>
                {age && gender && (
                  <p className="text-sm text-gray-300">
                    {age} years, {gender}
                  </p>
                )}
                {about && (
                  <p className="text-sm text-gray-300 line-clamp-2">{about}</p>
                )}
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  onClick={() => handleReview("rejected", _id)}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-gray-200 font-medium hover:bg-red-600 hover:border-red-600 hover:text-white transition"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleReview("accepted", _id)}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
