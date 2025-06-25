"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import type { Player as PlayerType } from "@lordicon/react";

import spot from "@/public/assets/icons/spot.json";

const Player = dynamic(() => import("@lordicon/react").then((mod) => mod.Player), {
  ssr: false,
}) as typeof PlayerType;

interface SpotProps {
  width: number;
}

const Spot = ({ width }: SpotProps) => {
  const playerRef = useRef<PlayerType>(null);

  useEffect(() => {
    playerRef.current?.playFromBeginning();
  }, []);

  const handleMouseEnter = () => {
    playerRef.current?.playFromBeginning();
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <button className="cursor-pointer">
        <Player ref={playerRef} icon={spot} size={width} />
      </button>
    </div>
  );
};

export default Spot;