"use client"
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import type { Player as PlayerType } from '@lordicon/react';

const Player = dynamic(() => import('@lordicon/react').then(mod => mod.Player), {
    ssr: false
}) as typeof PlayerType;

const event = require('@/public/assets/icons/event.json');
const Event = ({ width, height }: { width: number; height: number }) => {
    const playerRef = useRef<PlayerType>(null);

    useEffect(() => {
        playerRef.current?.playFromBeginning();
    }, []);

    const handleMouseEnter = () => {
        playerRef.current?.playFromBeginning();
    };

    return (
        <div onMouseEnter={handleMouseEnter}>
            <button className='cursor-pointer'>
            <Player
                ref={playerRef}
                icon={event}
                size={width}
            />
            </button>
        </div>
    )
}

export default Event