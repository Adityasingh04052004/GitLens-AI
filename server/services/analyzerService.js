import fs from 'fs/promises'
import path from 'path'

// List of configuration files we care about
const TARGET_CONFIG_FILES = [
  'readme.md',
  'package.json',
  'requirements.txt',
  'pom.xml',
  'build.gradle',
  'cargo.toml',
  'composer.json',
  'dockerfile',
  'docker-compose.yml',
  'go.mod',
  'package-lock.json'
]

// Folders we should never scan to prevent performance and memory issues
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

class AnalyzerService {
  
  /**
   * Scans a directory recursively to find target files up to a certain depth.
   * @param {string} dir - The absolute directory path to scan.
   * @param {number} maxDepth - The maximum folder depth to traverse.
   * @param {number} currentDepth - The current folder depth in recursion.
   * @returns {Promise<string[]>} Array of absolute paths to target files found.
   */
  async findTargetFiles(dir, maxDepth = 3, currentDepth = 0) {
    if (currentDepth > maxDepth) return []

    let results = []
    let list

    try {
      list = await fs.readdir(dir, { withFileTypes: true })
    } catch (error) {
      console.error(`[AnalyzerService] Failed to read directory ${dir}:`, error.message)
      return []
    }

    for (const file of list) {
      const filePath = path.join(dir, file.name)

      if (file.isDirectory()) {
        // Skip ignored directories
        if (IGNORED_FOLDERS.includes(file.name.toLowerCase())) continue
        
        const subdirectoryFiles = await this.findTargetFiles(filePath, maxDepth, currentDepth + 1)
        results = results.concat(subdirectoryFiles)
      } else if (file.isFile()) {
        // Check if the file is one of our target config files
        if (TARGET_CONFIG_FILES.includes(file.name.toLowerCase())) {
          results.push(filePath)
        }
      }
    }

    return results
  }

  /**
   * Reads the contents of target files, guarding against excessively large file reads.
   * @param {string} localPath - The absolute path of the cloned repository.
   * @param {string[]} filePaths - The list of absolute paths of target files.
   * @returns {Promise<Object>} Object mapping relative file paths to their truncated contents.
   */
  async readTargetFiles(localPath, filePaths) {
    const fileContents = {}
    const MAX_CHARACTERS = 20000 // Guard to prevent memory overflow (approx 20KB per file)

    for (const filePath of filePaths) {
      try {
        const relativePath = path.relative(localPath, filePath).replace(/\\/g, '/')
        
        // Read file contents (as text)
        const content = await fs.readFile(filePath, 'utf8')
        
        // Truncate if file exceeds size limit
        const isTruncated = content.length > MAX_CHARACTERS
        const cleanContent = isTruncated ? content.slice(0, MAX_CHARACTERS) + '\n... [TRUNCATED] ...' : content

        fileContents[relativePath] = {
          content: cleanContent,
          isTruncated
        }
      } catch (error) {
        console.error(`[AnalyzerService] Failed to read file ${filePath}:`, error.message)
      }
    }

    return fileContents
  }

  /**
   * Main entry point to analyze a cloned repository.
   * @param {string} localPath - The absolute path of the cloned repository.
   * @returns {Promise<{ files: Object }>} Object containing found target files and their contents.
   */
  async analyzeCodebase(localPath) {
    console.log(`[AnalyzerService] Starting static analysis on: ${localPath}`)
    
    // 1. Find all target files up to depth 3
    const targetFilePaths = await this.findTargetFiles(localPath)
    
    // 2. Read the contents of the found files
    const fileContents = await this.readTargetFiles(localPath, targetFilePaths)

    console.log(`[AnalyzerService] Analysis completed. Found ${Object.keys(fileContents).length} target files.`)
    
    return {
      files: fileContents
    }
  }
}

export default new AnalyzerService()
