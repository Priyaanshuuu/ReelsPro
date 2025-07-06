"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusSquare, Heart, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?._id;

  const isLandingPage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/auth")) return null;

  const navItems = [
    { name: "Home", href: "/feed", icon: <Home className="w-6 h-6" /> },
    { name: "Upload", href: "/upload", icon: <PlusSquare className="w-6 h-6" /> },
    { name: "Activity", href: "/activity", icon: <Heart className="w-6 h-6" /> },
    { name: "Profile", href: userId ? `/profile/${userId}` : "#", icon: <UserCircle className="w-6 h-6" /> },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isLandingPage
            ? isScrolled
              ? "bg-[#111827]/90 backdrop-blur border-b border-gray-700"
              : "bg-transparent"
            : "bg-[#111827]/90 backdrop-blur border-b border-gray-700"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <Link href="/" className="text-white text-xl font-semibold">
            ReelsPro
          </Link>

          <nav className="flex space-x-6 text-white">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link href={item.href}>{item.icon}</Link>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-300 bg-[#1f2937] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200">
                  {item.name}
                </span>
              </div>
            ))}

            <button
              onClick={() => signOut()}
              className="relative group focus:outline-none"
              title="Logout"
              type="button"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                />
              </svg>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-300 bg-[#1f2937] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200">
                Logout
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Spacer to avoid content hidden behind fixed navbar */}
      <div className="h-16" />
    </>
  );
}
