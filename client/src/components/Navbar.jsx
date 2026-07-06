import React, { useState } from 'react'
import { FaGithub, FaTerminal, FaBars, FaXmark } from 'react-icons/fa6'

export default function Navbar({ onReset }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'AI Explorer', href: '#ai-explorer' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={onReset}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-850 bg-zinc-900 text-zinc-150 group-hover:border-violet-500/40 group-hover:text-violet-400 transition-all duration-300">
              <FaTerminal className="text-xs" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-zinc-100 group-hover:text-white transition-colors">
                GitLens AI
              </span>
              <span className="text-[8px] font-semibold uppercase tracking-wider text-violet-400/90">
                Codebase Assistant
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition-colors relative py-1.5 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-violet-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-zinc-850 bg-zinc-950/40 px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
            >
              <FaGithub className="text-sm" />
              Star
            </a>
            <button
              onClick={onReset}
              className="rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-3.5 py-1.5 text-xs font-bold shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Analyze Repo
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-850 bg-zinc-900/30 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaXmark className="text-base" /> : <FaBars className="text-base" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide Down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-900 bg-zinc-950/95 backdrop-blur-lg animate-in slide-in-from-top duration-200">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-all"
              >
                {link.name}
              </a>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-900 mt-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-850 bg-zinc-950/40 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-900"
              >
                <FaGithub />
                GitHub
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onReset()
                }}
                className="rounded-lg bg-violet-600 py-2 text-xs font-bold text-white text-center hover:bg-violet-500 cursor-pointer"
              >
                Analyze Repo
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
