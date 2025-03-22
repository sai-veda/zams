import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#FAFAFA] px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col max-w-[800px] w-full mx-auto space-y-1 sm:space-y-2">
        {/* Logo */}
        <div className="flex items-center mb-8 sm:mb-12">
          <Image 
            src="/logo-dark.svg" 
            alt="Logo" 
            width={35} 
            height={19}
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
          className="text-4xl sm:text-5xl font-semibold mb-10 sm:mb-16 gradient-text-2 text-left"
          style={{ fontFamily: "var(--font-sherpa)" }}
        >
          What&apos;d you like to ask today?
        </h2>
        
        <div className="w-full relative">
          <Input 
            type="text" 
            placeholder="Ask whatever you want.." 
            className="w-full px-4 pt-5 pb-14 text-base font-normal rounded-xl border border-[#E4E7EC] shadow-[0_1px_2px_0_rgba(10,13,18,0.05)] focus:outline-none focus:ring-0 focus:border-gray-300"
            style={{ 
              fontFamily: "var(--font-inter)",
              color: "#667085" 
            }}
          />
          
          {/* Response type dropdown with updated styling */}
          <div className="absolute left-4 bottom-4 flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 7L8 10L11 7" stroke="#6941C6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ 
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              fontSize: "12px",
              lineHeight: "18px",
              letterSpacing: "0%",
              textAlign: "center",
              color: "#667085"
            }}>
              Response Type
            </span>
          </div>
          
          {/* Add attachment button */}
          <div className="absolute left-[150px] bottom-4 flex items-center gap-1 hidden sm:flex">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="#667085" strokeWidth="1.5"/>
              <path d="M8 5V11" stroke="#667085" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M5 8H11" stroke="#667085" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ 
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              fontSize: "12px",
              lineHeight: "18px",
              letterSpacing: "0%",
              textAlign: "center",
              color: "#667085"
            }}>
              Add Attachment
            </span>
          </div>
          
          {/* Character count */}
          <div className="absolute right-14 bottom-4" style={{ 
            fontFamily: "var(--font-inter)",
            fontWeight: 500,
            fontSize: "12px",
            lineHeight: "18px",
            letterSpacing: "0%",
            textAlign: "center",
            color: "#667085"
          }}>
            0/1000
          </div>
          
          {/* Submit button */}
          <button className="absolute right-4 bottom-3 bg-black text-white rounded-full p-1.5">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 10H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 5L15 10L10 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
