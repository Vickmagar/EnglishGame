"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import GameBoard from "@/components/GameBoard";

export default function GamePage() {
  const router = useRouter();

  useEffect(() => {
    const playerName = localStorage.getItem("playerName");
    if (!playerName) {
      router.push("/");
    }
  }, [router]);

  return <GameBoard />;
}
