"use client";

import Navbar from "@/components/Homepage/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ConnectKitButton, useSIWE } from "connectkit";
import { useRouter } from "next/navigation";
import Router from "next/router";

import { useAccount } from "@particle-network/connect-react-ui";
import ProposalComponent from "@/components/Proposal";
import Homepage from "./homepage/page";
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
    <Homepage/>
  );
}
