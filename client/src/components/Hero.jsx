import React from 'react'
import { FaTerminal } from 'react-icons/fa6'

export default function Hero({ children }) {
  return (
    <div className="relative mx-auto max-w-3xl px-4 pt-16 pb-12 text-center sm:px-6 lg:pt-24 lg:pb-16">
      
      {/* Muted Neutral Backdrop Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-500/5 blur-[120px] pointer-events-none" />

      {/* Main Hero Wrapper */}
      <div className="flex flex-col items-center space-y-6">
        
        {/* Minimal Tagline Badge */}
        <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-850 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-450 backdrop-blur-md">
          <FaTerminal className="text-[10px] text-zinc-555" />
          <span className="font-medium text-[11px] tracking-tight">v1.0 Release</span>
          <span className="h-1 w-1 rounded-full bg-zinc-500" />
        </div>

        {/* Crisp Value Proposition Title */}
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
          Navigate Any Repository <br />
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Like a Core Maintainer.
          </span>
        </h2>

        {/* Human-readable Description */}
        <p className="mx-auto max-w-lg text-sm text-zinc-400 leading-relaxed">
          Instant codebase exploration. Paste a public GitHub URL to clone the repository, generate a clean file hierarchy tree, auto-detect frameworks, and access structured AI explanations.
        </p>

        {/* Children Slot for URL Input Form */}
        <div className="w-full max-w-lg pt-2">
          {children}
        </div>

      </div>
    </div>
  )
}
