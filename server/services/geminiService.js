import { GoogleGenerativeAI } from '@google/generative-ai'

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY
    
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey)
      // We use gemini-1.5-flash as the default model (fast and highly cost-efficient)
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    } else {
      console.warn('[GeminiService] Warning: GEMINI_API_KEY is not defined in .env. Falling back to template summaries.')
    }
  }

  /**
   * Generates a text representation of the file tree to pass into the prompt.
   * @param {Object[]} tree - The folder tree array.
   * @param {number} depth - The indentation depth.
   * @returns {string} Text outline of the file tree.
   */
  stringifyTree(tree, depth = 0) {
    let result = ''
    const indent = '  '.repeat(depth)

    for (const node of tree) {
      if (node.type === 'directory') {
        result += `${indent}├── ${node.name}/\n`
        if (node.children) {
          result += this.stringifyTree(node.children, depth + 1)
        }
      } else {
        result += `${indent}└── ${node.name}\n`
      }
    }
    return result
  }

  /**
   * Assembles a prompt and calls Gemini to synthesize a repository overview.
   * @param {string} repoName - The repository name.
   * @param {Object} technologies - Grouped detected technologies object.
   * @param {Object[]} tree - The mapped repository file tree.
   * @param {Object} files - Cloned config files content mapping.
   * @returns {Promise<string>} The generated markdown summary.
   */
  async generateSummary(repoName, technologies, tree, files) {
    // Graceful fallback if the API key is missing
    if (!this.apiKey) {
      return this.generateMockSummary(repoName, technologies)
    }

    // 1. Convert the file tree structure to a clean indent string outline
    const treeOutline = this.stringifyTree(tree)

    // 2. Extract key file details (README and package.json contents)
    const readmeFile = Object.keys(files).find(p => p.toLowerCase().endsWith('readme.md'))
    const readmeContent = readmeFile ? files[readmeFile].content : 'No README.md available.'

    const packageJsonFile = Object.keys(files).find(p => p.toLowerCase().endsWith('package.json'))
    const packageJsonContent = packageJsonFile ? files[packageJsonFile].content : 'No package.json available.'

    // 3. Assemble the prompt payload
    const prompt = `
You are an expert software architect analyzing a cloned codebase repository named "${repoName}".

Here is the structured metadata we gathered:
- **Detected Stack**:
  * Languages: ${technologies.languages.join(', ') || 'None detected'}
  * Frontend: ${technologies.frontend.join(', ') || 'None detected'}
  * Backend: ${technologies.backend.join(', ') || 'None detected'}
  * Databases: ${technologies.databases.join(', ') || 'None detected'}

- **File Tree Structure**:
\`\`\`
${treeOutline}
\`\`\`

- **README.md (Truncated if large)**:
\`\`\`markdown
${readmeContent}
\`\`\`

- **package.json (Truncated if large)**:
\`\`\`json
${packageJsonContent}
\`\`\`

Based on the file tree and contents, synthesize a professional, concise codebase summary formatted in Markdown. 
Provide:
1. **Overview**: A 2-3 sentence high-level overview explaining what the application does.
2. **Architecture**: Briefly describe the key directories, structure layout, and how frontend/backend talk to each other.
3. **Core Features**: A bulleted list of the key functional features detected in the code configurations.

Keep the tone professional, objective, and developer-oriented. Do not include placeholders.
`

    try {
      console.log(`[GeminiService] Calling Gemini API for repo: ${repoName}...`)
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('[GeminiService] API call failed:', error.message)
      return `### Analysis Summary for ${repoName}\n\n*Error generating live AI summary: ${error.message}*\n\n${this.generateMockSummary(repoName, technologies)}`
    }
  }

  /**
   * Helper fallback to return a detailed template summary if API credentials are not set.
   */
  generateMockSummary(repoName, technologies) {
    const langs = technologies.languages.join(', ') || 'General Files'
    const front = technologies.frontend.join(', ') || 'Static HTML'
    const back = technologies.backend.join(', ') || 'Static Files'
    
    return `### Codebase Summary for **${repoName}** (Demo Mode)

> [!NOTE]
> **API Key Missing**: To see live AI-generated summaries, add your \`GEMINI_API_KEY\` to your \`server/.env\` file and restart the server.

#### Overview
This codebase is a template repository named **${repoName}**. It is structured using modern architectural patterns and is configured for building scalable full-stack applications.

#### Architecture
The codebase layout suggests a separation of concerns optimized for:
*   **Languages**: ${langs}
*   **Frontend**: ${front}
*   **Backend**: ${back}

#### Core Features
*   **Codebase Explorer**: Automatic recursive mapping of files and folders.
*   **Configuration Parsing**: Programmatic reading of manifest files like package.json and requirements.txt.
*   **Technology Classifier**: Rules-based dependencies classification system.
`
  }
}

export default new GeminiService()
