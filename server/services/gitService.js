import simpleGit from 'simple-git'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

// Resolve paths in ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Base directory where repositories will be cloned
const REPOS_DIR = path.resolve(__dirname, '../repos')

/**
 * Service to handle Git operations.
 */
class GitService {
  constructor() {
    // Ensure the main repos directory exists on startup
    if (!fs.existsSync(REPOS_DIR)) {
      fs.mkdirSync(REPOS_DIR, { recursive: true })
    }
  }

  /**
   * Generates a unique, filesystem-safe hash for a given URL.
   * @param {string} repoUrl - The GitHub repository URL.
   * @returns {string} The SHA-256 hash representing the folder name.
   */
  getRepoHash(repoUrl) {
    return crypto
      .createHash('sha256')
      .update(repoUrl.trim().toLowerCase())
      .digest('hex')
  }

  /**
   * Clones a public repository if it does not already exist.
   * @param {string} repoUrl - The public GitHub repository URL.
   * @returns {Promise<{localPath: string, isDuplicate: boolean}>} Object containing the folder path and clone status.
   */
  async cloneRepository(repoUrl) {
    const hash = this.getRepoHash(repoUrl)
    const localPath = path.join(REPOS_DIR, hash)

    // Check if the repository has already been cloned
    if (fs.existsSync(localPath)) {
      console.log(`[GitService] Repo already exists locally at: ${hash}`)
      return {
        localPath,
        isDuplicate: true
      }
    }

    console.log(`[GitService] Starting clone for: ${repoUrl} into ${hash}`)
    
    // Configure simple-git options (like depth=1 to clone fast without full history)
    const git = simpleGit()
    await git.clone(repoUrl, localPath, [
      '--depth', '1', // Clone only the latest commit (extremely fast & space efficient)
      '--no-single-branch' // But keep branches if needed later
    ])

    console.log(`[GitService] Clone completed successfully for: ${hash}`)
    return {
      localPath,
      isDuplicate: false
    }
  }
}

export default new GitService()
