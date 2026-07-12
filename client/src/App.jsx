import React, { useState } from 'react'
import axios from 'axios'
import { 
  FaFolder, 
  FaMicrochip, 
  FaLightbulb, 
  FaSpinner, 
  FaCircleCheck,
  FaCodeBranch
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

  const loadingMessages = [
    'Configuring secure workspace container...',
    'Cloning remote GitHub repository assets...',
    'Analyzing directory trees and files map...',
    'Detecting tech stack configurations...',
    'Synthesizing AI project architectural summary...'
  ]

  const handleUrlSubmit = async (submittedUrl) => {
    setUrl(submittedUrl)
    setApiError('')
    setStatus('analyzing')
    setLoadingStep(0)

    // Tick the loading logs slowly in the background during network request
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        // Hold at step 3 (stack detection) until we get the actual API response
        if (prev < 3) {
          return prev + 1
        }
        return prev
      })
    }, 1200)

    try {
      // POST request to our Express backend
      const response = await axios.post('http://127.0.0.1:5000/api/repository/analyze', {
        url: submittedUrl
      })

      // Complete the loading step animation
      clearInterval(stepInterval)
      setLoadingStep(4)
      setRepoData(response.data)

      // Short delay so the user sees the final step check off, then transition to dashboard
      setTimeout(() => {
        setStatus('completed')
      }, 850)

    } catch (err) {
      clearInterval(stepInterval)
      console.error('[App] Analysis call failed:', err)

      // Extract validation errors or connection issues
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
      title: 'Repository Cloning',
      description: 'Programmatically clones public repositories into a temporary workspace to check configurations.',
      badge: 'Git Engine'
    },
    {
      icon: FaFolder,
      title: 'File Tree Mapping',
      description: 'Traverses folder structures to index codebase maps and file configurations.',
      badge: 'File API'
    },
    {
      icon: FaMicrochip,
      title: 'Stack Detection',
      description: 'Scans config files and scripts to auto-identify frameworks, databases, and languages.',
      badge: 'Auto Detector'
    },
    {
      icon: FaLightbulb,
      title: 'AI Codebase Summary',
      description: 'Leverages Gemini LLM to interpret repository structures and explain features.',
      badge: 'Gemini AI'
    }
  ]

  // Helper function to format detected technology badges
  const getBadgeString = (techArray) => {
    if (!techArray || techArray.length === 0) return 'None detected'
    return techArray.join(' / ')
  }

  return (
    <div className="min-h-screen bg-[#090A0C] text-zinc-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-zinc-800 selection:text-white">
      
      {/* Super Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/4 -z-20 h-[500px] w-[500px] rounded-full bg-zinc-700/2 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 -z-20 h-[500px] w-[500px] rounded-full bg-zinc-700/2 blur-[100px] pointer-events-none" />

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
              <div className="text-center space-y-1.5 mb-8">
                <h3 className="text-sm font-bold tracking-tight text-zinc-100 uppercase">Engineered For Detail</h3>
                <p className="text-xs text-zinc-455 max-w-sm mx-auto">
                  Execute static configurations and structure mapping for complete codebase visibility.
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
          <div className="w-full max-w-md p-7 rounded-xl border border-zinc-900 bg-zinc-955/20 backdrop-blur-md text-center space-y-5 animate-slide-up">
            
            {/* Clean Gray Spinner */}
            <div className="relative inline-flex items-center justify-center mx-auto">
              <div className="w-12 h-12 rounded-full border-2 border-zinc-900 border-t-zinc-300 animate-spin" />
              <div className="absolute text-zinc-550">
                <FaSpinner className="text-xs animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-150 tracking-tight">Analyzing Codebase</h3>
              <p className="text-xs text-zinc-455 h-5 transition-all">
                {loadingMessages[loadingStep]}
              </p>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="w-full bg-zinc-900 h-0.5 rounded-full overflow-hidden">
              <div 
                className="bg-zinc-350 h-full transition-all duration-500 ease-out"
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
                  <span className={index === loadingStep ? 'text-zinc-200 font-semibold' : ''}>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-955/20 border border-zinc-900 backdrop-blur-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 uppercase tracking-tight">Repository</span>
                  <h3 className="text-sm font-bold text-zinc-100 tracking-tight">
                    {repoData.repository.split('/').filter(Boolean).pop()}
                  </h3>
                </div>
                <p className="text-[10px] text-zinc-555 truncate max-w-sm sm:max-w-md mt-1">{repoData.repository}</p>
              </div>
              <button 
                onClick={handleReset}
                className="text-[11px] text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-850 px-4 py-2 rounded-lg border border-zinc-800 transition-colors font-semibold cursor-pointer"
              >
                Reset Analysis
              </button>
            </div>

            {/* Dashboard Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              
              {/* Left Column: Repository Tree Panel (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col rounded-xl bg-zinc-950/10 border border-zinc-900 backdrop-blur-sm overflow-hidden min-h-[440px] max-h-[600px]">
                <div className="px-3.5 py-2.5 border-b border-zinc-900/60 bg-zinc-900/20 flex items-center gap-2">
                  <FaFolder className="text-zinc-500 text-xs" />
                  <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">File Structure</span>
                </div>
                <div className="p-4 flex-1 overflow-y-auto space-y-2.5">
                  <div className="text-zinc-650 italic text-[9px] mb-1.5 font-mono">// Interactive codebase explorer</div>
                  <FileTree tree={repoData.tree} />
                </div>
              </div>

              {/* Right Column: Summaries & Stack (8 Cols) */}
              <div className="lg:col-span-8 flex flex-col space-y-5 justify-between">
                
                {/* Tech Stack Panel */}
                <div className="rounded-xl bg-zinc-950/10 border border-zinc-900 backdrop-blur-sm overflow-hidden">
                  <div className="px-3.5 py-2.5 border-b border-zinc-900/60 bg-zinc-900/20 flex items-center gap-2">
                    <FaMicrochip className="text-zinc-500 text-xs" />
                    <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">Detected Stack</span>
                  </div>
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <div className="p-3 rounded-lg bg-zinc-955/20 border border-zinc-900 text-center space-y-1">
                      <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider">Frontend</span>
                      <p className="text-[11px] font-bold text-zinc-200 truncate">{getBadgeString(repoData.technologies.frontend)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-955/20 border border-zinc-900 text-center space-y-1">
                      <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider">Backend</span>
                      <p className="text-[11px] font-bold text-zinc-200 truncate">{getBadgeString(repoData.technologies.backend)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-955/20 border border-zinc-900 text-center space-y-1">
                      <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider">Database</span>
                      <p className="text-[11px] font-bold text-zinc-200 truncate">{getBadgeString(repoData.technologies.databases)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-955/20 border border-zinc-900 text-center space-y-1">
                      <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider">Language</span>
                      <p className="text-[11px] font-bold text-zinc-200 truncate">{getBadgeString(repoData.technologies.languages)}</p>
                    </div>
                  </div>
                </div>

                {/* AI Summary Panel */}
                <div className="flex-1 rounded-xl bg-zinc-950/10 border border-zinc-900 backdrop-blur-sm overflow-hidden flex flex-col min-h-[290px] max-h-[460px]">
                  <div className="px-3.5 py-2.5 border-b border-zinc-900/60 bg-zinc-900/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaLightbulb className="text-zinc-500 text-xs" />
                      <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">AI Project Overview</span>
                    </div>
                    <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/10 border border-emerald-900/15 px-2 py-0.5 rounded flex items-center gap-1">
                      <FaCircleCheck className="text-[9px]" /> Verified
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
