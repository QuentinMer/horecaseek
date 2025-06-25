"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import type { Player as PlayerType } from "@lordicon/react";

import restaurant from "@/public/assets/icons/restaurant.json";

const Player = dynamic(() => import("@lordicon/react").then((mod) => mod.Player), {
  ssr: false,
}) as typeof PlayerType;

interface RestaurantProps {
  width: number;
}

const Restaurant = ({ width }: RestaurantProps) => {
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
        <Player ref={playerRef} icon={restaurant} size={width} />
      </button>
    </div>
  );
};

export default Restaurant;