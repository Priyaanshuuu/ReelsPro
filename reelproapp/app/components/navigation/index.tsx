"use client";

import { useSession } from "next-auth/react";
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
          </nav>
        </div>
      </header>

      <div className="h-16" />
      <nav className="flex space-x-6 text-white">
        {navItems.map((item) => (
          <div key={item.name} className="relative group">
            <Link href={item.href}>{item.icon}</Link>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-300 bg-[#1f2937] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200">
              {item.name}
            </span>
          </div>
        ))}
      </nav>
    </>
  );
}