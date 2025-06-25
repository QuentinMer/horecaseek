"use client"
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import type { Player as PlayerType } from '@lordicon/react';

const Player = dynamic(() => import('@lordicon/react').then(mod => mod.Player), {
    ssr: false
}) as typeof PlayerType;

const spot = require('@/public/assets/icons/spot.json');

const Spot = ({ width, height }: { width: number; height: number }) => {
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
                icon={spot}
                size={width}
            />
            </button>
        </div>
    )
}

export default Spot