import React, { useState } from 'react'
import axios from 'axios'
import { 
  FaFolder, 
  FaSpinner, 
  FaCircleCheck,
  FaCodeBranch,
  FaCompass,
  FaLayerGroup,
  FaBookOpen
} from 'react-icons/fa6'

// Modular Component Imports
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import UrlInput from './components/UrlInput.jsx'
import FeatureCard from './components/FeatureCard.jsx'
import FileTree from './components/FileTree.jsx'
import MarkdownViewer from './components/MarkdownViewer.jsx'

export default function App() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('idle') // idle, analyzing, completed
  const [loadingStep, setLoadingStep] = useState(0)
  const [repoData, setRepoData] = useState(null)
  const [apiError, setApiError] = useState('')

  // Conversational and friendly loading logs
  const loadingMessages = [
    'Setting up a cozy workspace for your project...',
    'Fetching the repository files from GitHub...',
    'Reading through the directory structure...',
    'Learning the technology stack and frameworks...',
    'Writing down our custom architectural notes...'
  ]

  const handleUrlSubmit = async (submittedUrl) => {
    setUrl(submittedUrl)
    setApiError('')
    setStatus('analyzing')
    setLoadingStep(0)

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < 3) {
          return prev + 1
        }
        return prev
      })
    }, 1200)

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/repository/analyze', {
        url: submittedUrl
      })

      clearInterval(stepInterval)
      setLoadingStep(4)
      setRepoData(response.data)

      setTimeout(() => {
        setStatus('completed')
      }, 850)

    } catch (err) {
      clearInterval(stepInterval)
      console.error('[App] Analysis call failed:', err)

      const errMsg = err.response?.data?.errors?.[0]?.message || 
                     err.response?.data?.message || 
                     'Unable to connect to the backend server. Make sure it is running in your terminal.'

      setApiError(errMsg)
      setStatus('idle')
      setUrl('')
    }
  }

  const handleReset = () => {
    setUrl('')
    setStatus('idle')
    setRepoData(null)
    setApiError('')
  }

  const features = [
    {
      icon: FaCodeBranch,
      title: 'Cozy Workspace',
      description: 'We download public repositories into a temporary workspace so we can inspect them safely.',
      badge: 'Git Fetch'
    },
    {
      icon: FaCompass,
      title: 'Visual Folder Map',
      description: 'We trace the directory layout recursively to build a clean, interactively clickable file browser.',
      badge: 'Visual Explorer'
    },
    {
      icon: FaLayerGroup,
      title: 'Smart Tech Finder',
      description: 'We check configurations and settings files to auto-identify languages, databases, and frameworks.',
      badge: 'Stack Lookup'
    },
    {
      icon: FaBookOpen,
      title: 'Friendly Tour Guide',
      description: 'Gemini reads through your project configuration and drafts a detailed walkthrough.',
      badge: 'Gemini Guide'
    }
  ]

  const getBadgeString = (techArray) => {
    if (!techArray || techArray.length === 0) return 'None detected'
    return techArray.join(' / ')
  }

  return (
    <div className="min-h-screen bg-[#090A0C] text-zinc-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-250">
      
      {/* Cozy, organic background ambient glows */}
      <div 
        className="absolute top-0 left-1/3 -z-20 h-[600px] w-[600px] rounded-full bg-amber-900/4 blur-[130px] pointer-events-none animate-pulse" 
        style={{ animationDuration: '8s' }} 
      />
      <div 
        className="absolute bottom-0 right-1/3 -z-20 h-[600px] w-[600px] rounded-full bg-rose-950/3 blur-[130px] pointer-events-none animate-pulse" 
        style={{ animationDuration: '10s' }} 
      />

      {/* 1. Navbar */}
      <Navbar onReset={handleReset} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 z-10 w-full">

        {/* STATE 1: IDLE / LANDING PAGE */}
        {status === 'idle' && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            
            {/* Hero & URL Input */}
            <Hero>
              <UrlInput onSubmit={handleUrlSubmit} apiError={apiError} />
            </Hero>

            {/* Feature Cards Grid Section */}
            <section id="features" className="w-full max-w-4xl py-12 border-t border-zinc-900/60 mt-4">
              <div className="text-center space-y-2 mb-8">
                <h3 className="text-sm font-serif text-zinc-100 tracking-wide">Designed for Developers</h3>
                <p className="text-[11px] text-zinc-450 max-w-sm mx-auto">
                  A simple static scanner to map layout paths and identify tech frameworks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {features.map((feature, idx) => (
                  <div key={idx} className="animate-slide-up" style={{ animationDelay: `${idx * 80}ms` }}>
                    <FeatureCard
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      badge={feature.badge}
                    />
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* STATE 2: ANALYZING / PROGRESSIVE LOGS */}
        {status === 'analyzing' && (
          <div className="w-full max-w-md p-7 rounded-xl border border-zinc-850/60 bg-zinc-955/20 backdrop-blur-md text-center space-y-5 animate-slide-up">
            
            {/* Soft Amber Spinner */}
            <div className="relative inline-flex items-center justify-center mx-auto">
              <div className="w-12 h-12 rounded-full border-2 border-zinc-900 border-t-amber-500/80 animate-spin" />
              <div className="absolute text-zinc-550">
                <FaSpinner className="text-xs animate-pulse text-amber-500/80" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-serif text-zinc-150 tracking-wide">Looking Around</h3>
              <p className="text-xs text-zinc-450 h-5 transition-all">
                {loadingMessages[loadingStep]}
              </p>
            </div>

            {/* Warm Progress Bar */}
            <div className="w-full bg-zinc-900 h-0.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500/70 h-full transition-all duration-500 ease-out"
                style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
              />
            </div>

            {/* Logging Terminal */}
            <div className="bg-zinc-955/40 rounded-lg p-3.5 border border-zinc-900 text-left font-mono text-[10px] text-zinc-550 space-y-2 max-h-[150px] overflow-y-auto">
              {loadingMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-2.5 transition-all duration-200 ${index > loadingStep ? 'opacity-10' : 'opacity-100'}`}
                >
                  <span className="text-zinc-650 font-bold select-none">&gt;</span>
                  <span className={index === loadingStep ? 'text-amber-250 font-semibold' : ''}>
                    {msg} {index < loadingStep && '✓'}
                  </span>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* STATE 3: COMPLETED / DEVELOPER WORKSPACE PREVIEW */}
        {status === 'completed' && repoData && (
          <div className="w-full max-w-5xl flex flex-col space-y-5 py-6 animate-fade-in">
            
            {/* Dashboard Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-955/20 border border-zinc-850/60 backdrop-blur-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-900/20 bg-amber-950/5 text-amber-200/80 uppercase tracking-tight">Repository</span>
                  <h3 className="text-sm font-bold text-zinc-100 tracking-tight">
                    {repoData.repository.split('/').filter(Boolean).pop()}
                  </h3>
                </div>
                <p className="text-[10px] text-zinc-555 truncate max-w-sm sm:max-w-md mt-1">{repoData.repository}</p>
              </div>
              <button 
                onClick={handleReset}
                className="text-[11px] text-amber-200/80 hover:text-amber-100 bg-zinc-900 hover:bg-zinc-850 px-4 py-2 rounded-lg border border-zinc-800 transition-colors font-semibold cursor-pointer"
              >
                Reset Tour
              </button>
            </div>

            {/* Dashboard Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              
              {/* Left Column: Repository Tree Panel (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col rounded-xl bg-zinc-950/10 border border-zinc-850/60 backdrop-blur-sm overflow-hidden min-h-[440px] max-h-[600px]">
                <div className="px-3.5 py-2.5 border-b border-zinc-850/60 bg-zinc-900/20 flex items-center gap-2">
                  <FaCompass className="text-amber-500/70 text-xs" />
                  <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">Workspace Explorer</span>
                </div>
                <div className="p-4 flex-1 overflow-y-auto space-y-2.5">
                  <div className="text-zinc-655 italic text-[9px] mb-1.5 font-mono">// Click folders to look inside</div>
                  <FileTree tree={repoData.tree} />
                </div>
              </div>

              {/* Right Column: Summaries & Stack (8 Cols) */}
              <div className="lg:col-span-8 flex flex-col space-y-5 justify-between">
                
                {/* Tech Stack Panel */}
                <div className="rounded-xl bg-zinc-950/10 border border-zinc-850/60 backdrop-blur-sm overflow-hidden">
                  <div className="px-3.5 py-2.5 border-b border-zinc-850/60 bg-zinc-900/20 flex items-center gap-2">
                    <FaLayerGroup className="text-amber-500/70 text-xs" />
                    <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">Technologies Used</span>
                  </div>
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <div className="p-3 rounded-lg bg-zinc-955/20 border border-zinc-850/60 text-center space-y-1">
                      <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider">Frontend</span>
                      <p className="text-[11px] font-bold text-zinc-200 truncate">{getBadgeString(repoData.technologies.frontend)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-955/20 border border-zinc-850/60 text-center space-y-1">
                      <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider">Backend</span>
                      <p className="text-[11px] font-bold text-zinc-200 truncate">{getBadgeString(repoData.technologies.backend)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-955/20 border border-zinc-850/60 text-center space-y-1">
                      <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider">Database</span>
                      <p className="text-[11px] font-bold text-zinc-200 truncate">{getBadgeString(repoData.technologies.databases)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-955/20 border border-zinc-850/60 text-center space-y-1">
                      <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider">Language</span>
                      <p className="text-[11px] font-bold text-zinc-200 truncate">{getBadgeString(repoData.technologies.languages)}</p>
                    </div>
                  </div>
                </div>

                {/* AI Summary Panel */}
                <div className="flex-1 rounded-xl bg-zinc-950/10 border border-zinc-850/60 backdrop-blur-sm overflow-hidden flex flex-col min-h-[290px] max-h-[460px]">
                  <div className="px-3.5 py-2.5 border-b border-zinc-850/60 bg-zinc-900/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaBookOpen className="text-amber-500/70 text-xs" />
                      <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">A Tour of the Codebase</span>
                    </div>
                    <span className="text-[8px] font-bold text-amber-400 bg-amber-950/15 border border-amber-900/20 px-2 py-0.5 rounded flex items-center gap-1">
                      <FaCircleCheck className="text-[9px]" /> Summary Ready
                    </span>
                  </div>
                  
                  <div className="p-5 flex-1 overflow-y-auto space-y-3.5">
                    <MarkdownViewer text={repoData.summary} />
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900/30 py-3.5 px-6 text-center text-[9px] text-zinc-650 z-10 bg-zinc-955/5">
        GitLens AI © {new Date().getFullYear()} — Premium Full-Stack Portfolio. Built with React & Express.
      </footer>
    </div>
  )
}
