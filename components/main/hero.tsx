"use client";

import React from "react";
import MissionControlHUD from "@/components/main/projects";

export const Hero = () => {
  return (
    <div className="relative flex flex-col h-full w-full">
      {/* Immersive 3D Space Background Layer */}
      <video
        autoPlay
        muted
        loop
        className="rotate-180 absolute top-[-340px] left-0 w-full h-full object-cover -z-20 opacity-40"
      >
        <source src="/videos/blackhole.webm" type="video/webm" />
      </video>

      {/* Mounting Your Real-Time Mission Control Hub Workspace directly onto the center canvas */}
      <div className="pt-24 min-h-screen w-full flex items-center justify-center">
        <MissionControlHUD />
      </div>
    </div>
  );
};

