"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import type { Player as PlayerType } from "@lordicon/react";

import house from "@/public/assets/icons/house.json";

const Player = dynamic(() => import("@lordicon/react").then((mod) => mod.Player), {
  ssr: false,
}) as typeof PlayerType;

interface HouseProps {
  width: number;
}

const House = ({ width }: HouseProps) => {
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
        <Player ref={playerRef} icon={house} size={width} />
      </button>
    </div>
  );
};

export default House;