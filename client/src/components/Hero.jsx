import React from 'react'
import { FaCompass } from 'react-icons/fa6'

export default function Hero({ children }) {
  return (
    <div className="relative mx-auto max-w-3xl px-4 pt-16 pb-12 text-center sm:px-6 lg:pt-24 lg:pb-16 animate-fade-in">
      
      {/* Muted Neutral Backdrop Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-500/5 blur-[120px] pointer-events-none" />

      {/* Main Hero Wrapper */}
      <div className="flex flex-col items-center space-y-6">
        
        {/* Warm Organic Tagline Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-900/20 bg-amber-950/5 px-3.5 py-1 text-[11px] text-amber-200/80 backdrop-blur-md">
          <FaCompass className="text-[10px] text-amber-400/80" />
          <span className="font-medium tracking-tight">Your Codebase Explorer</span>
          <span className="h-1 w-1 rounded-full bg-amber-500/80" />
        </div>

        {/* Serif Font Header (Lora) */}
        <h2 className="text-3xl font-serif tracking-tight text-white sm:text-4xl md:text-5xl leading-tight select-none">
          Welcome to Your New Repository.<br />
          <span className="bg-gradient-to-r from-white to-amber-100/70 bg-clip-text text-transparent italic font-normal">
            Let's explore it together.
          </span>
        </h2>

        {/* Human-readable Description */}
        <p className="mx-auto max-w-lg text-sm text-zinc-400 leading-relaxed">
          Paste a public GitHub link below. We will download the files, map out the directories, and write a friendly architectural guide so you can feel right at home in minutes.
        </p>

        {/* Children Slot for URL Input Form */}
        <div className="w-full max-w-lg pt-2">
          {children}
        </div>

      </div>
    </div>
  )
}
