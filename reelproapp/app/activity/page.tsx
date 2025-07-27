"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle } from "lucide-react";

// Define proper types
interface User {
  _id: string;
  name: string;
  email: string;
}

interface Reel {
  _id: string;
  caption?: string;
  videoUrl: string;
  thumbnailUrl?: string;
}

interface Notification {
  _id: string;
  type: "like" | "comment";
  from?: User;
  reel?: Reel;
  comment?: string;
  createdAt: string;
  read: boolean;
}

export default function ActivityPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json();
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = (reelId: string | undefined) => {
    if (reelId) {
      router.push(`/reel/${reelId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#181824] via-[#1a1a2e] to-[#0f3460] py-10 px-2 flex justify-center items-center">
        <div className="text-white text-lg">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181824] via-[#1a1a2e] to-[#0f3460] py-10 px-2 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-[#181824]/90 rounded-2xl shadow-2xl border border-[#23234a] p-6">
        <h2 className="text-3xl font-bold text-white mb-8 text-center tracking-tight drop-shadow-lg">
          Activity
        </h2>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[30vh] text-center">
            <Heart className="h-12 w-12 text-indigo-500 mb-4" />
            <span className="text-gray-400 text-lg">No notifications yet.</span>
            <p className="text-sm text-gray-500 mt-2">
              You&apos;ll see likes and comments on your reels here.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className="bg-[#23234a] rounded-xl p-5 flex items-center gap-4 shadow-lg border border-[#2d2d5a] hover:bg-[#28284d] transition-colors duration-200 cursor-pointer"
                onClick={() => handleNotificationClick(notification.reel?._id)}
              >
                <div className="flex-shrink-0">
                  {notification.type === "like" ? (
                    <Heart className="text-pink-500 w-7 h-7 fill-current" />
                  ) : (
                    <MessageCircle className="text-blue-400 w-7 h-7" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="font-semibold text-white">
                      {notification.from?.name || "Someone"}
                    </span>
                    {notification.type === "like" ? (
                      <span className="text-gray-300">liked your reel</span>
                    ) : (
                      <>
                        <span className="text-gray-300">commented:</span>
                        {notification.comment && (
                          <span className="italic text-indigo-300 ml-1">
                            &ldquo;{notification.comment}&rdquo;
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {notification.reel?.caption && (
                    <div className="text-sm text-indigo-400 mt-1 truncate">
                      On: {notification.reel.caption}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}