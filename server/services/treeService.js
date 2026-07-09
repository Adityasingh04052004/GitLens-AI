import fs from 'fs/promises'
import path from 'path'

// Folders we must ignore during folder tree mapping
const IGNORED_FOLDERS = [
  'node_modules',
  '.git',
  '.github',
  'dist',
  'build',
  'target',
  'vendor',
  '.next',
  '.nuxt',
  'out'
]

class TreeService {
  /**
   * Recursively builds a JSON directory tree structure.
   * @param {string} rootPath - The absolute path of the cloned repository root.
   * @param {string} currentPath - The absolute path of the directory currently being scanned.
   * @param {Object} state - Shared state to track total nodes scanned (to prevent infinite loops).
   * @returns {Promise<Object[]>} Array of tree node objects.
   */
  async buildNodeTree(rootPath, currentPath = rootPath, state = { nodeCount: 0, maxNodes: 1000 }) {
    // Safety guard to avoid scanning massive repos and crashing the system
    if (state.nodeCount >= state.maxNodes) {
      return []
    }

    let items = []
    try {
      items = await fs.readdir(currentPath, { withFileTypes: true })
    } catch (error) {
      console.error(`[TreeService] Failed to read directory ${currentPath}:`, error.message)
      return []
    }

    const nodes = []

    for (const item of items) {
      // Safety limit check
      if (state.nodeCount >= state.maxNodes) {
        break
      }

      const absolutePath = path.join(currentPath, item.name)
      const relativePath = path.relative(rootPath, absolutePath).replace(/\\/g, '/')

      state.nodeCount++

      if (item.isDirectory()) {
        // Skip ignored folders
        if (IGNORED_FOLDERS.includes(item.name.toLowerCase())) continue

        const children = await this.buildNodeTree(rootPath, absolutePath, state)
        nodes.push({
          name: item.name,
          path: relativePath,
          type: 'directory',
          children
        })
      } else if (item.isFile()) {
        nodes.push({
          name: item.name,
          path: relativePath,
          type: 'file'
        })
      }
    }

    // Sort nodes: Directories first, then files alphabetically (standards for IDEs)
    return nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
  }

  /**
   * Main entry point to build a repository tree.
   * @param {string} localPath - The absolute path of the cloned repository.
   * @returns {Promise<Object[]>} The completed JSON tree array.
   */
  async generateRepoTree(localPath) {
    console.log(`[TreeService] Generating repository tree for: ${localPath}`)
    const tree = await this.buildNodeTree(localPath)
    console.log(`[TreeService] Tree generation completed.`)
    return tree
  }
}

export default new TreeService()
