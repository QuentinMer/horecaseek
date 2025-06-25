"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import type { Player as PlayerType } from "@lordicon/react";

import event from "@/public/assets/icons/event.json";

const Player = dynamic(() => import("@lordicon/react").then((mod) => mod.Player), {
  ssr: false,
}) as typeof PlayerType;

interface EventProps {
  width: number;
}

const Event = ({ width }: EventProps) => {
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
        <Player ref={playerRef} icon={event} size={width} />
      </button>
    </div>
  );
};

export default Event;