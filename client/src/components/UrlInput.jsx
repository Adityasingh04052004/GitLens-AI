import React, { useState } from 'react'
import { FaGithub, FaTriangleExclamation } from 'react-icons/fa6'

export default function UrlInput({ onSubmit }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const validateUrl = (inputUrl) => {
    const trimmed = inputUrl.trim()
    if (!trimmed) {
      return 'Please enter a GitHub repository URL.'
    }
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+(\/)?$/
    if (!githubRegex.test(trimmed)) {
      return 'Please enter a valid public GitHub URL (e.g., https://github.com/user/repo).'
    }
    return ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationError = validateUrl(url)
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    onSubmit(url.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3.5">
      
      {/* Structural Input Container */}
      <div className="relative flex items-center bg-zinc-900/30 border border-zinc-850 rounded-xl p-1.5 focus-within:border-violet-600/60 transition-colors duration-250">
        
        {/* GitHub Icon */}
        <div className="pl-3.5 text-zinc-550 focus-within:text-violet-400 transition-colors">
          <FaGithub className="text-lg" />
        </div>

        {/* Text Input */}
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            if (error) setError('')
          }}
          placeholder="https://github.com/username/repository"
          className="w-full bg-transparent border-0 outline-none px-3 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:ring-0"
        />

        {/* Vibrant Accent Button */}
        <button
          type="submit"
          className="bg-gradient-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-md shadow-violet-650/10 active:scale-[0.99] cursor-pointer shrink-0 transition-all duration-200"
        >
          Analyze
        </button>

      </div>

      {/* Subtle Error Alert */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs justify-center bg-red-950/10 border border-red-900/20 py-2 px-3 rounded-lg animate-in fade-in slide-in-from-top-1 duration-150">
          <FaTriangleExclamation className="text-xs shrink-0" />
          <span>{error}</span>
        </div>
      )}

    </form>
  )
}
