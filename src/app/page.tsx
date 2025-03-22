import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex flex-col items-start min-h-screen w-full bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 pt-6">
      <div className="flex flex-col max-w-[800px] mx-auto w-full space-y-1">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-12">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-medium text-black">zams</span>
        </div>
        
        {/* Hey there, - with static gradient */}
        <h1 
          className="text-5xl font-bold gradient-text-1"
          style={{ fontFamily: "var(--font-sherpa)" }}
        >
          Hey there,
        </h1>
        
        {/* What'd you like to ask today? - with static gradient */}
        <h2 
          className="text-5xl font-bold mb-10 gradient-text-2"
          style={{ fontFamily: "var(--font-sherpa)" }}
        >
          What&apos;d you like to ask today?
        </h2>
        
        {/* Text field with enhanced styling to match the screenshot */}
        <div className="w-full relative">
          <Input 
            type="text" 
            placeholder="Ask whatever you want.." 
            className="w-full px-4 pt-4 pb-12 text-base font-normal rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300"
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
          <div className="absolute left-[150px] bottom-4 flex items-center gap-1">
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
