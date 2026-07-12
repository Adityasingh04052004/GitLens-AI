import React, { useState } from 'react'
import { FaFolder, FaFolderOpen, FaFileCode } from 'react-icons/fa6'

/**
 * Individual Node component representing a file or directory.
 * If the node is a directory, it recursively renders its children.
 */
function TreeNode({ node }) {
  const isDir = node.type === 'directory'
  const [isOpen, setIsOpen] = useState(true) // Default directories to expanded

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="flex flex-col select-none text-[11px] font-mono leading-relaxed">
      
      {/* Node Header Row */}
      <div 
        onClick={isDir ? toggleOpen : undefined}
        className={`flex items-center gap-2 py-1 px-1.5 rounded transition-colors ${
          isDir ? 'cursor-pointer hover:bg-zinc-900/60 text-zinc-300 hover:text-white' : 'text-zinc-450 hover:text-zinc-200'
        }`}
      >
        {isDir ? (
          <>
            {isOpen ? (
              <FaFolderOpen className="text-zinc-500 text-xs shrink-0" />
            ) : (
              <FaFolder className="text-zinc-550 text-xs shrink-0" />
            )}
            <span className="font-semibold tracking-tight">{node.name}</span>
          </>
        ) : (
          <>
            <FaFileCode className="text-zinc-600 text-xs shrink-0 pl-0.5" />
            <span>{node.name}</span>
          </>
        )}
      </div>

      {/* Recursive Children Container */}
      {isDir && isOpen && node.children && (
        <div className="pl-4 ml-2 border-l border-zinc-900/60 flex flex-col space-y-0.5">
          {node.children.map((child, idx) => (
            <TreeNode key={idx} node={child} />
          ))}
        </div>
      )}

    </div>
  )
}

/**
 * Main FileTree Explorer Component.
 * @param {Object[]} tree - Root level tree node array.
 */
export default function FileTree({ tree }) {
  if (!tree || tree.length === 0) {
    return (
      <div className="text-zinc-650 italic text-[10px] p-2">
        // Empty repository workspace
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-1">
      {tree.map((node, idx) => (
        <TreeNode key={idx} node={node} />
      ))}
    </div>
  )
}
