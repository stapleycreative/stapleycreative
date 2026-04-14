"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function StereoPortrait() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null); // Top (Purple)
  const layer2Ref = useRef<HTMLDivElement>(null); // Middle (Blue)
  const layer3Ref = useRef<HTMLDivElement>(null); // Bottom (Green)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current || !layer1Ref.current || !layer2Ref.current || !layer3Ref.current) return;

    // As we scroll through the container, they converge from offset positions to center.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 95%", // When top of element enters viewport
        end: "center center", // Fully converge when centered
        scrub: 0.5,
      }
    });

    // Start positions (split apart significantly to make the scroll scrub obvious)
    gsap.set(layer1Ref.current, { y: -120, opacity: 0.8 });
    gsap.set(layer2Ref.current, { y: 0, opacity: 0.8 });
    gsap.set(layer3Ref.current, { y: 120, opacity: 0.8 });

    // Converge to singular lock
    tl.to(layer1Ref.current, { y: 0, opacity: 1, ease: "power1.out" }, 0)
      .to(layer3Ref.current, { y: 0, opacity: 1, ease: "power1.out" }, 0)
      .to(layer2Ref.current, { opacity: 1, ease: "power1.out" }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="w-full flex justify-center py-24">
      <div ref={containerRef} className="relative w-full max-w-[400px] aspect-[4/5] mx-auto group">
        
        {/* Layer 3 - Bottom (Cyan) */}
        <div 
          ref={layer3Ref} 
          className="absolute inset-0 rounded-[20px] overflow-hidden transition-transform duration-500 ease-out"
        >
          <Image 
             src="/craig-cyan.png" 
             alt="Portrait Cyan Channel" 
             fill 
             className="object-cover" 
          />
        </div>

        {/* Layer 2 - Middle (Pink) */}
        <div 
          ref={layer2Ref} 
          className="absolute inset-0 rounded-[20px] overflow-hidden transition-transform duration-500 ease-out"
        >
          <Image 
             src="/craig-pink.png" 
             alt="Portrait Pink Channel" 
             fill 
             className="object-cover" 
          />
        </div>

        {/* Layer 1 - Top (Dark) */}
        <div 
          ref={layer1Ref} 
          className="absolute inset-0 rounded-[20px] overflow-hidden transition-transform duration-500 ease-out"
        >
          <Image 
             src="/craig-dark.png" 
             alt="Portrait Dark Channel" 
             fill 
             className="object-cover" 
          />
        </div>

      </div>
    </div>
  );
}
