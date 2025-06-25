"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useAnimation,
  useTransform,
  PanInfo,
  ResolvedValues,
} from "framer-motion";

const IMGS: { url: string; caption: string }[] = [
  { url: "/assets/img/card/bar-exemple.jpg", caption: "Bar" },
  { url: "/assets/img/card/event-exemple.jpg", caption: "Traiteur" },
  { url: "/assets/img/card/hotel-exemple.jpg", caption: "Hotel" },
  { url: "/assets/img/card/restaurant-exemple.jpg", caption: "Restaurant" },
  { url: "/assets/img/card/spot-exemple.jpg", caption: "Spot" },
];

interface RollingGalleryProps {
  autoplay?: boolean;
  pauseOnHover?: boolean;
  images?: { url: string; caption: string }[];
}

const RollingGallery: React.FC<RollingGalleryProps> = ({
  autoplay = false,
  pauseOnHover = false,
  images = [],
}) => {
  const galleryImages = images.length > 0 ? images : IMGS;

  const [isScreenSizeSm, setIsScreenSizeSm] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsScreenSizeSm(window.innerWidth <= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cylinderWidth: number = isScreenSizeSm ? 1100 : 1800;
  const faceCount: number = galleryImages.length;
  const faceWidth: number = (cylinderWidth / faceCount) * 1.5;
  const radius: number = cylinderWidth / (2 * Math.PI);

  const dragFactor: number = 0.05;
  const rotation = useMotionValue(0);
  const controls = useAnimation();

  const transform = useTransform(rotation, (val: number) => `rotate3d(0,1,0,${val}deg)`);

  const startInfiniteSpin = (startAngle: number) => {
    controls.start({
      rotateY: [startAngle, startAngle - 360],
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  useEffect(() => {
    if (autoplay) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    } else {
      controls.stop();
    }
  }, [autoplay]);

  const handleUpdate = (latest: ResolvedValues) => {
    if (typeof latest.rotateY === "number") {
      rotation.set(latest.rotateY);
    }
  };

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    controls.stop();
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    const finalAngle = rotation.get() + info.velocity.x * dragFactor;
    rotation.set(finalAngle);
    if (autoplay) {
      startInfiniteSpin(finalAngle);
    }
  };

  const handleMouseEnter = (): void => {
    if (autoplay && pauseOnHover) {
      controls.stop();
    }
  };

  const handleMouseLeave = (): void => {
    if (autoplay && pauseOnHover) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    }
  };

  return (
    <div className="flex h-full items-center justify-center [perspective:4000px] [transform-style:preserve-3d] mb-32">
      <motion.div
        drag="x"
        dragElastic={0}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={controls}
        onUpdate={handleUpdate}
        style={{
          transform: transform,
          rotateY: rotation,
          width: cylinderWidth,
          transformStyle: "preserve-3d",
        }}
        className="flex min-h-[200px] cursor-grab items-center justify-center [transform-style:preserve-3d]"
      >
        {galleryImages.map(({ url, caption }, i) => (
          <div
            key={i}
            className="group absolute flex flex-col items-center justify-center p-[8%] md:p-[6%] [backface-visibility:hidden]"
            style={{
              width: `${faceWidth}px`,
              transform: `rotateY(${(360 / faceCount) * i}deg) translateZ(${radius}px)`,
            }}
          >
            <Image
              src={url}
              alt={caption}
              width={isScreenSizeSm ? 200 : 400} 
              height={isScreenSizeSm ? 200 : 260}
              className="pointer-events-none border border-primary rounded-[15px] object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              unoptimized 
            />
            <span className="mt-2 text-center text-primary text-sm md:text-xl font-geist">{caption}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default RollingGallery;