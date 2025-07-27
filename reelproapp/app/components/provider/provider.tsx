"use client";

import { SessionProvider } from "next-auth/react";
import { ImageKitProvider } from "@imagekit/next";
import { NotificationProvider } from "../notification";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

export default function Providers({ children }: { children: React.ReactNode }) {
  const authenticator = async () => {
    try {
      const res = await fetch("/api/imagekit-auth");
      if (!res.ok) {
        throw new Error("Failed to fetch ImageKit authentication");
      }
      return res.json();
    } catch (error) {
      console.error("Error fetching ImageKit authentication:", error);
      throw error;
    }
  };

  return (
    <SessionProvider>
      <NotificationProvider>
        <ImageKitProvider
          publicKey={publicKey}
          urlEndpoint={urlEndpoint}
          authenticator={authenticator}
        >
          {children}
        </ImageKitProvider>
      </NotificationProvider>
    </SessionProvider>
  );
}