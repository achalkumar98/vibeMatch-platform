"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { useAppDispatch } from "@/redux/hooks";
import { removeUserFromFeed } from "@/redux/slices/feedSlice";
import { sendRequestApi } from "@/api/requestApi";
import type { FeedUser } from "@/types";

interface UserCardProps {
  user: FeedUser;
  editable?: boolean;
  zIndex?: number;
}

export default function UserCard({
  user,
  editable = false,
  zIndex = 1,
}: UserCardProps) {
  const { _id, firstName, lastName, age, gender, photoUrl, about } = user;
  const dispatch = useAppDispatch();

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -50, 50, 200], [0, 1, 1, 0]);

  const handleSendRequest = async (
    status: "interested" | "ignored",
    userId: string
  ) => {
    try {
      await sendRequestApi(status, userId);
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Failed to send request:", err);
    }
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number } }
  ) => {
    if (editable) return;
    if (info.offset.x > 120) {
      handleSendRequest("interested", _id);
    } else if (info.offset.x < -120) {
      handleSendRequest("ignored", _id);
    }
  };

  return (
    <motion.div
      drag={!editable ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity, zIndex: editable ? "auto" : zIndex }}
      className={`
        ${editable ? "relative" : "absolute"}
        w-72 sm:w-[350px] md:w-[380px] lg:w-[400px]
        h-[70vh] sm:h-[480px] md:h-[490px] lg:h-[510px]
        bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col mx-auto
      `}
    >
      {/* Cover image */}
      <div className="h-72 sm:h-[280px] md:h-[290px] lg:h-[310px] relative">
        <Image
          src={photoUrl || "https://www.gravatar.com/avatar?d=mp"}
          alt={`${firstName}'s photo`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 288px, (max-width: 768px) 350px, 400px"
        />
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <h2 className="text-xl sm:text-2xl font-bold truncate">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <p className="text-sm text-gray-200">
              {age} years old, {gender}
            </p>
          )}
        </div>
      </div>

      {/* About */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        {about ? (
          <p className="text-gray-300 text-sm break-words">{about}</p>
        ) : (
          <p className="text-gray-500 text-sm italic">
            No additional information provided.
          </p>
        )}

        {editable && (
          <div className="pt-2 border-t border-gray-700 text-xs text-gray-400 text-center mt-2">
            This is a preview of your profile
          </div>
        )}
      </div>
    </motion.div>
  );
}
