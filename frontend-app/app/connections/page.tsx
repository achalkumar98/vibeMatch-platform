"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addConnections } from "@/redux/slices/connectionSlice";
import { getConnectionsApi } from "@/api/connectionApi";

export default function ConnectionsPage() {
  const connections = useAppSelector((state) => state.connections);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getConnectionsApi();
        dispatch(addConnections(data));
      } catch (err) {
        console.error("Failed to fetch connections:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-100 text-lg my-10">
        Loading connections...
      </p>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <h1 className="flex justify-center text-gray-100 text-lg my-10">
        No Connections Found
      </h1>
    );
  }

  return (
    <div className="text-center my-10 px-4 sm:px-6 md:px-8">
      <h1 className="font-bold text-white text-3xl mb-6">Connections</h1>
      <div className="flex flex-col gap-6">
        {connections.map(({ _id, firstName, lastName, photoUrl, age, gender, about }) => (
          <div
            key={_id}
            className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-gray-800 text-white border border-gray-700 shadow-md transition-transform hover:scale-105 hover:bg-gray-700 w-full md:w-2/3 lg:w-1/2 mx-auto"
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
            <Link href={`/chat/${_id}`} className="mt-2 sm:mt-0">
              <button className="px-4 py-2 rounded-lg border border-gray-600 text-gray-200 font-medium hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition">
                Chat
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
