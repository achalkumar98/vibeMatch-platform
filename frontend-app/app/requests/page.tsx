"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { UserPlus, Check, X, Loader2, Inbox } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addRequests, removeRequest } from "@/redux/slices/requestSlice";
import { getReceivedRequestsApi } from "@/api/connectionApi";
import { reviewRequestApi } from "@/api/requestApi";

export default function RequestsPage() {
  const requests = useAppSelector((s) => s.requests);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getReceivedRequestsApi();
        dispatch(addRequests(data));
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        toast.error("Could not load requests. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  const handleReview = async (status: "accepted" | "rejected", requestId: string) => {
    const id = toast.loading(status === "accepted" ? "Accepting…" : "Declining…");
    try {
      await reviewRequestApi(status, requestId);
      dispatch(removeRequest(requestId));
      toast.success(
        status === "accepted" ? "Connection accepted!" : "Request declined.",
        { id }
      );
    } catch (err) {
      console.error("Error reviewing request:", err);
      toast.error("Action failed. Please try again.", { id });
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)", paddingTop: "56px" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <UserPlus size={20} style={{ color: "var(--brand)" }} strokeWidth={1.8} aria-hidden />
            <h1 className="page-title">Connection Requests</h1>
          </div>
          {requests && requests.length > 0 && (
            <span className="vm-badge vm-badge-brand">
              {requests.length} pending
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={22} className="animate-spin" style={{ color: "var(--text-muted)" }} aria-label="Loading" />
          </div>
        ) : !requests || requests.length === 0 ? (
          <div className="text-center py-20">
            <Inbox size={40} className="mx-auto mb-4" style={{ color: "var(--border-strong)" }} aria-hidden />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No pending connection requests.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2" role="list">
            {requests.map((request) => {
              const { _id, fromUserId } = request;
              const { firstName, lastName, photoUrl, age, gender, about } = fromUserId;
              return (
                <li
                  key={_id}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl"
                  style={{ border: "1px solid var(--border)", background: "var(--bg-surface)" }}
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={photoUrl || "https://www.gravatar.com/avatar?d=mp"}
                      alt={`${firstName}'s avatar`}
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {firstName} {lastName}
                      </span>
                      {age && gender && (
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {age} · {gender}
                        </span>
                      )}
                    </div>
                    {about && (
                      <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>{about}</p>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleReview("rejected", _id)}
                      className="vm-btn vm-btn-outline text-xs px-3 py-1.5"
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background   = "var(--error-bg)";
                        el.style.borderColor  = "var(--error)";
                        el.style.color        = "var(--error)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background   = "transparent";
                        el.style.borderColor  = "var(--border-strong)";
                        el.style.color        = "var(--text-primary)";
                      }}
                      aria-label={`Decline request from ${firstName}`}
                    >
                      <X size={13} strokeWidth={2} aria-hidden />
                      <span className="hidden sm:inline">Decline</span>
                    </button>
                    <button
                      onClick={() => handleReview("accepted", _id)}
                      className="vm-btn vm-btn-primary text-xs px-3 py-1.5"
                      aria-label={`Accept request from ${firstName}`}
                    >
                      <Check size={13} strokeWidth={2} aria-hidden />
                      <span className="hidden sm:inline">Accept</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
