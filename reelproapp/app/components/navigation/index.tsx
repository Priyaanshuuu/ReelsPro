"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, PlusSquare, Heart, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const isLandingPage = pathname === "/";

  // Scroll effect logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show navbar on auth pages
  if (pathname.startsWith("/auth")) return null;

  return (
    <>
      {/* Navbar */}
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
            <Link href="/feed">
              <Home className="w-6 h-6" />
            </Link>
            <Link href="/discover">
              <Compass className="w-6 h-6" />
            </Link>
            <Link href="/upload">
              <PlusSquare className="w-6 h-6" />
            </Link>
            <Link href="/activity">
              <Heart className="w-6 h-6" />
            </Link>
            <Link href="/profile">
              <UserCircle className="w-6 h-6" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Padding for content below navbar */}
      <div className="h-16" />
    </>
  );
}
