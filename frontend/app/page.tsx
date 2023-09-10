"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ConnectKitButton, useSIWE } from "connectkit";
import { useRouter } from "next/navigation";
import Router from "next/router";

import { useAccount } from "@particle-network/connect-react-ui";
export default function Home() {
  const { data, isSignedIn, signOut, signIn } = useSIWE();
  const account = useAccount();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="h-full relative">
      <Navbar title="title" />
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-400">
          Welcome
        </h1>
        <p className="text-sm">{account && account}</p>
        <h2 className="text-2xl tracking-tight text-gray-500 p-2">
          Lets get started!
        </h2>
        <Link href="/dashboard">
          <Button variant="default">Go to Dashboard</Button>
        </Link>
      </main>
    </div>
  );
}
