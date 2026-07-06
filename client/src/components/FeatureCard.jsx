import React from 'react'

export default function FeatureCard({ icon: Icon, title, description, badge }) {
  return (
    <div className="relative group rounded-xl border border-zinc-900 bg-zinc-950/10 p-5 backdrop-blur-sm hover:border-zinc-800/80 hover:bg-zinc-900/5 transition-all duration-250 flex items-start gap-4 text-left">
      
      {/* Icon Wrapper (Hover Highlights) */}
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-850 bg-zinc-900/50 text-zinc-400 group-hover:text-violet-400 group-hover:border-violet-500/35 group-hover:bg-violet-600/5 transition-all duration-250 shrink-0">
        <Icon className="text-base" />
      </div>

      {/* Text Context */}
      <div className="space-y-1.5 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-zinc-100 tracking-tight truncate">{title}</h3>
          {badge && (
            <span className="rounded-md bg-violet-950/20 border border-violet-900/30 px-2 py-0.5 text-[9px] font-semibold text-violet-400/90 tracking-tight">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-450 leading-relaxed">{description}</p>
      </div>

    </div>
  )
}
