import React, { useState, useEffect } from 'react'
import { 
  FaGithub, 
  FaSpinner, 
  FaTriangleExclamation, 
  FaCircleCheck, 
  FaFolder, 
  FaFileCode, 
  FaCpu, 
  FaLightbulb, 
  FaTerminal 
} from 'react-icons/fa6'

function App() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle') // idle, analyzing, completed
  const [loadingStep, setLoadingStep] = useState(0)

  const loadingMessages = [
    'Initializing secure workspace...',
    'Cloning remote GitHub repository...',
    'Analyzing folder structures and files...',
    'Detecting languages and frameworks...',
    'Synthesizing AI project summary...'
  ]

  // Simulate progress steps for a rich loading experience
  useEffect(() => {
    let interval
    if (status === 'analyzing') {
      setLoadingStep(0)
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loadingMessages.length - 1) {
            return prev + 1
          } else {
            clearInterval(interval)
            // Wait 1 more second after final step, then complete
            setTimeout(() => setStatus('completed'), 1000)
            return prev
          }
        })
      }, 1500)
    }
    return () => clearInterval(interval)
  }, [status])

  // Validate GitHub URL
  const validateGithubUrl = (inputUrl) => {
    const trimmed = inputUrl.trim()
    if (!trimmed) {
      return 'Repository URL is required.'
    }
    // Basic regex validation for public GitHub repositories
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+(\/)?$/
    if (!githubRegex.test(trimmed)) {
      return 'Please enter a valid public GitHub repository URL (e.g., https://github.com/user/repo).'
    }
    return ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationError = validateGithubUrl(url)
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setStatus('analyzing')
  }

  const handleReset = () => {
    setUrl('')
    setError('')
    setStatus('idle')
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans relative overflow-hidden">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/30 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <FaTerminal className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              GitLens AI
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold">Codebase Assistant</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <FaGithub className="text-xl" />
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        
        {/* STATE 1: IDLE / INPUT */}
        {status === 'idle' && (
          <div className="max-w-2xl w-full text-center space-y-8 py-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-400 text-xs font-medium animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Empowered by Gemini AI
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Understand Any GitHub Codebase <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  In Seconds.
                </span>
              </h2>
              <p className="text-slate-400 text-base md:text-lg max-w-lg mx-auto">
                Paste a public GitHub URL to clone, automatically detect its technical stack, generate files tree, and unlock AI-powered summaries.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-[2px] opacity-20 group-focus-within:opacity-40 transition-opacity" />
                <div className="relative flex items-center bg-slate-900/80 border border-slate-800 rounded-2xl p-2 group-focus-within:border-slate-700 transition-all">
                  <div className="pl-3 text-slate-500">
                    <FaGithub className="text-xl" />
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="w-full bg-transparent border-0 outline-none px-3 py-3 text-sm text-slate-100 placeholder-slate-500 focus:ring-0"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-[0.98] cursor-pointer"
                  >
                    Analyze
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs justify-center bg-red-950/20 border border-red-900/30 py-2.5 px-4 rounded-lg">
                  <FaTriangleExclamation />
                  <span>{error}</span>
                </div>
              )}
            </form>

            {/* Micro details / Feature Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 max-w-lg mx-auto text-xs text-slate-500">
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-900/20 border border-slate-800/40">
                <FaFolder className="text-slate-400 text-sm" />
                <span>Tree Mapper</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-900/20 border border-slate-800/40">
                <FaCpu className="text-slate-400 text-sm" />
                <span>Tech Detector</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-900/20 border border-slate-800/40">
                <FaLightbulb className="text-slate-400 text-sm" />
                <span>AI Explainer</span>
              </div>
            </div>
          </div>
        )}

        {/* STATE 2: ANALYZING / LOADING */}
        {status === 'analyzing' && (
          <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900/40 border border-slate-850 backdrop-blur-md text-center space-y-6">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin" />
              <div className="absolute text-blue-400">
                <FaSpinner className="text-lg animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Analyzing Codebase</h3>
              <p className="text-sm text-slate-400 min-h-[20px] transition-all">
                {loadingMessages[loadingStep]}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
              />
            </div>

            {/* Progressive Logging terminal */}
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-850 text-left font-mono text-[11px] text-slate-400 space-y-1 max-h-[140px] overflow-y-auto">
              {loadingMessages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-2 ${index > loadingStep ? 'opacity-20' : 'opacity-100'}`}>
                  <span className="text-blue-500 font-bold select-none">&gt;</span>
                  <span className={index === loadingStep ? 'text-blue-400 font-medium' : ''}>
                    {msg} {index < loadingStep && '✓'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATE 3: COMPLETED / MOCK WORKSPACE PREVIEW */}
        {status === 'completed' && (
          <div className="w-full max-w-6xl flex flex-col space-y-6 py-6 animate-fadeIn">
            
            {/* Dashboard Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/30 border border-slate-800/80 backdrop-blur-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">Public</span>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {url.split('/').pop() || 'mock-repository'}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 truncate max-w-md mt-1">{url}</p>
              </div>
              <button 
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-lg border border-slate-700/60 transition-all font-medium cursor-pointer"
              >
                Analyze Another URL
              </button>
            </div>

            {/* Dashboard Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column: Repository Tree Panel (3 Cols) */}
              <div className="lg:col-span-4 flex flex-col rounded-xl bg-slate-900/20 border border-slate-800/80 backdrop-blur-sm overflow-hidden min-h-[450px]">
                <div className="px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/40 flex items-center gap-2">
                  <FaFolder className="text-slate-400 text-sm" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Repository Tree</span>
                </div>
                <div className="p-4 flex-1 font-mono text-xs text-slate-300 space-y-2 overflow-y-auto">
                  <div className="text-slate-500 italic text-[11px] mb-2">// Sample repository layout map</div>
                  <div className="flex items-center gap-1.5"><FaFolder className="text-blue-400" /> client</div>
                  <div className="flex items-center gap-1.5 pl-4"><FaFolder className="text-blue-400" /> src</div>
                  <div className="flex items-center gap-1.5 pl-8"><FaFolder className="text-blue-400" /> components</div>
                  <div className="flex items-center gap-1.5 pl-12"><FaFileCode className="text-emerald-400" /> Button.jsx</div>
                  <div className="flex items-center gap-1.5 pl-8"><FaFolder className="text-blue-400" /> pages</div>
                  <div className="flex items-center gap-1.5 pl-12"><FaFileCode className="text-emerald-400" /> Home.jsx</div>
                  <div className="flex items-center gap-1.5 pl-8"><FaFileCode className="text-emerald-400" /> App.jsx</div>
                  <div className="flex items-center gap-1.5 pl-4"><FaFileCode className="text-slate-400" /> package.json</div>
                  <div className="flex items-center gap-1.5"><FaFolder className="text-blue-400" /> server</div>
                  <div className="flex items-center gap-1.5 pl-4"><FaFolder className="text-blue-400" /> controllers</div>
                  <div className="flex items-center gap-1.5 pl-8"><FaFileCode className="text-emerald-400" /> repoController.js</div>
                  <div className="flex items-center gap-1.5 pl-4"><FaFileCode className="text-slate-400" /> server.js</div>
                  <div className="flex items-center gap-1.5"><FaFileCode className="text-yellow-400" /> README.md</div>
                </div>
              </div>

              {/* Right Column: Summaries & Stack (8 Cols) */}
              <div className="lg:col-span-8 flex flex-col space-y-6">
                
                {/* Detected Stack Panel */}
                <div className="rounded-xl bg-slate-900/20 border border-slate-800/80 backdrop-blur-sm overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/40 flex items-center gap-2">
                    <FaCpu className="text-slate-400 text-sm" />
                    <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Detected Technologies</span>
                  </div>
                  <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 flex flex-col gap-1 text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Frontend</span>
                      <span className="text-sm font-semibold text-white">React / Vite</span>
                    </div>
                    <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 flex flex-col gap-1 text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Backend</span>
                      <span className="text-sm font-semibold text-white">Node / Express</span>
                    </div>
                    <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 flex flex-col gap-1 text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Database</span>
                      <span className="text-sm font-semibold text-white">MongoDB</span>
                    </div>
                    <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 flex flex-col gap-1 text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Language</span>
                      <span className="text-sm font-semibold text-white">JavaScript</span>
                    </div>
                  </div>
                </div>

                {/* AI Summary Panel */}
                <div className="flex-1 rounded-xl bg-slate-900/20 border border-slate-800/80 backdrop-blur-sm overflow-hidden flex flex-col min-h-[280px]">
                  <div className="px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaLightbulb className="text-yellow-400 text-sm" />
                      <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">AI Project Summary</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                      <FaCircleCheck /> Ready
                    </div>
                  </div>
                  <div className="p-6 flex-1 text-slate-300 text-sm leading-relaxed space-y-4">
                    <p className="font-semibold text-white">
                      This repository is a full-stack codebase utilizing JavaScript for both frontend and backend operations.
                    </p>
                    <p>
                      The frontend application is constructed using the modern React framework powered by Vite. It includes styling powered by Tailwind CSS. Code modularity is achieved through a clean component-based layout separating pages, reusable buttons/inputs, custom hooks, and services.
                    </p>
                    <p>
                      The server-side application is built using Node.js and Express.js, exposing RESTful endpoints. The data storage relies on a MongoDB database, utilizing Mongoose as the object data modeling library. The codebase integrates GitHub via simple-git and processes codebase summaries utilizing Gemini API services.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-4 px-6 text-center text-xs text-slate-500 z-10 bg-slate-950/30">
        GitLens AI © {new Date().getFullYear()} — Production Ready Portfolio Project. Built with React & Node.
      </footer>
    </div>
  )
}

export default App
