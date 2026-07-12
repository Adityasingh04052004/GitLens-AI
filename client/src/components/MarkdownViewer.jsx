import React from 'react'

/**
 * Lightweight, dependency-free Markdown compiler that maps standard Markdown tokens
 * into Tailwind CSS-styled HTML tags safely.
 */
export default function MarkdownViewer({ text }) {
  if (!text) return null

  const parseMarkdown = (md) => {
    // 1. Escape HTML characters to protect against XSS
    let html = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    // 2. Parse GitHub style blockquote alerts: > [!NOTE] content...
    html = html.replace(/^&gt;\s\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n([\s\S]*?)(?=(?:^&gt;|\n\n|\n$))/gm, (match, type, content) => {
      let colorClass = 'border-zinc-800 bg-zinc-950/40 text-zinc-300'
      if (type === 'IMPORTANT' || type === 'WARNING') {
        colorClass = 'border-amber-900/30 bg-amber-950/10 text-amber-300'
      } else if (type === 'TIP') {
        colorClass = 'border-emerald-900/30 bg-emerald-950/10 text-emerald-300'
      }
      
      const cleanContent = content.replace(/^&gt;\s?/gm, '').trim()
      return `<div class="p-3 my-4 rounded-lg border ${colorClass} text-[11px] leading-relaxed">
        <strong class="uppercase text-[10px] tracking-wide block mb-1">💡 ${type}</strong>
        ${cleanContent}
      </div>`
    })

    // 3. Translate standard markdown tokens
    html = html
      // Headings
      .replace(/^### (.*$)/gim, '<h3 class="text-xs font-bold uppercase tracking-wider text-zinc-250 mt-5 mb-2">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-xs font-semibold text-zinc-300 mt-4 mb-2">$1</h4>')
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-150 font-bold">$1</strong>')
      // Inline code blocks
      .replace(/`(.*?)`/g, '<code class="bg-zinc-900/60 border border-zinc-850 px-1 py-0.5 rounded text-[10px] text-zinc-250 font-mono">$1</code>')
      // Bullet list items
      .replace(/^\*\s(.*$)/gim, '<li class="ml-4 list-disc text-zinc-400 pl-1 py-0.5">$1</li>')
      .replace(/^-\s(.*$)/gim, '<li class="ml-4 list-disc text-zinc-400 pl-1 py-0.5">$1</li>')
      // Double returns to paragraph linebreaks
      .replace(/\n\n/g, '<br class="my-2" />')

    return html
  }

  const cleanHtml = parseMarkdown(text)

  return (
    <div 
      className="text-zinc-450 text-[11.5px] leading-relaxed space-y-2 select-text"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  )
}
