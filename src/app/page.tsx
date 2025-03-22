"use client";

import Image from "next/image";
import { Chat } from "@/components/Chat";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 relative pb-20">
      <div className="flex flex-col max-w-[800px] w-full mx-auto space-y-1 sm:space-y-2">
        {/* Logo */}
        <div className="flex items-center mb-6 sm:mb-8">
          <Image 
            src="/logo-dark.svg" 
            alt="Logo" 
            width={100} 
            height={30}
            priority
          />
        </div>
        
        {/* Hey there, - with static gradient */}
        <h1 
          className="text-4xl sm:text-5xl font-semibold gradient-text-1 text-left"
          style={{ fontFamily: "var(--font-sherpa)" }}
        >
          Hey there,
        </h1>
        
        {/* What'd you like to ask today? - with static gradient */}
        <h2 
          className="text-4xl sm:text-5xl font-semibold mb-4 sm:mb-6 gradient-text-2 text-left"
          style={{ 
            fontFamily: "var(--font-sherpa)",
            lineHeight: "1.2"  // Added line height to prevent text cut-off
          }}
        >
          What&apos;d you like to ask today?
        </h2>
        
        {/* Chat component */}
        <Chat />
      </div>
      
      {/* Footer text - made responsive */}
      <div className="absolute bottom-2 sm:bottom-6 w-full text-center px-4">
        <p className="text-[10px] sm:text-xs leading-tight sm:leading-normal" style={{
          fontFamily: "var(--font-inter)",
          fontWeight: 400,
          color: "#8A8A8A"
        }}>
          Your chats aren&apos;t used to train our models. Obviously AI may make mistakes, so please double-check. Your privacy is our priority.
        </p>
      </div>
    </div>
  );
}
