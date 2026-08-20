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
  }, [dispatch]);

  const handleReview = async (status: "accepted" | "rejected", requestId: string) => {
    try {
      await reviewRequestApi(status, requestId);
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error("Error reviewing request:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black" style={{ paddingTop: "56px" }}>
      <div className="max-w-3xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Connection Requests</h1>
          {requests && (
            <span className="text-sm text-white/30">{requests.length} pending</span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : !requests || requests.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-white/40 text-sm">No pending connection requests.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {requests.map((request) => {
              const { _id, fromUserId } = request;
              const { firstName, lastName, photoUrl, age, gender, about } = fromUserId;
              return (
                <div
                  key={_id}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl"
                  style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={photoUrl || "https://www.gravatar.com/avatar?d=mp"}
                      alt={`${firstName}'s avatar`}
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">
                        {firstName} {lastName}
                      </span>
                      {age && gender && (
                        <span className="text-xs text-white/30 flex-shrink-0">{age} · {gender}</span>
                      )}
                    </div>
                    {about && (
                      <p className="text-xs text-white/35 truncate mt-0.5">{about}</p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleReview("rejected", _id)}
                      className="vm-btn vm-btn-outline text-xs px-3 py-1.5 hover:border-red-500/50 hover:text-red-400"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleReview("accepted", _id)}
                      className="vm-btn vm-btn-white text-xs px-3 py-1.5"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
