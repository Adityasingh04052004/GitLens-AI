/**
 * Service to automatically detect programming languages, frontend frameworks,
 * backend frameworks, and database engines by scanning project configuration files.
 */
class TechDetectorService {
  
  /**
   * Scans the mapped configuration files and extracts technology metadata.
   * @param {Object} files - Object mapping relative file paths to their content and isTruncated status.
   * @returns {Object} Grouped array of detected technologies.
   */
  detectTechnologies(files) {
    const languages = new Set()
    const frontend = new Set()
    const backend = new Set()
    const databases = new Set()

    const filePaths = Object.keys(files)

    // 1. Scan file names to determine base language templates
    for (const filePath of filePaths) {
      const fileName = filePath.split('/').pop().toLowerCase()

      if (fileName === 'go.mod') {
        languages.add('Go')
      } else if (fileName === 'cargo.toml') {
        languages.add('Rust')
      } else if (fileName === 'composer.json') {
        languages.add('PHP')
      } else if (fileName === 'pom.xml' || fileName === 'build.gradle') {
        languages.add('Java')
      } else if (fileName === 'requirements.txt' || fileName === 'pipfile') {
        languages.add('Python')
      } else if (fileName === 'package.json') {
        languages.add('JavaScript') // Will check for TypeScript upgrade below
      }
    }

    // 2. Deep scan package.json content (Node/JS ecosystem)
    const packageJsonFile = filePaths.find(p => p.toLowerCase().endsWith('package.json'))
    if (packageJsonFile && files[packageJsonFile].content) {
      try {
        const packageJsonObj = JSON.parse(files[packageJsonFile].content)
        const deps = {
          ...packageJsonObj.dependencies,
          ...packageJsonObj.devDependencies
        }

        // Language upgrade
        if (deps['typescript']) {
          languages.add('TypeScript')
        }

        // Frontend frameworks
        if (deps['react']) frontend.add('React')
        if (deps['next']) frontend.add('Next.js')
        if (deps['vue']) frontend.add('Vue')
        if (deps['nuxt']) frontend.add('Nuxt.js')
        if (deps['@angular/core']) frontend.add('Angular')
        if (deps['svelte']) frontend.add('Svelte')

        // Backend frameworks
        if (deps['express']) backend.add('Express')
        if (deps['koa']) backend.add('Koa')
        if (deps['@nestjs/core']) backend.add('NestJS')

        // Databases
        if (deps['mongoose'] || deps['mongodb']) databases.add('MongoDB')
        if (deps['pg']) databases.add('PostgreSQL')
        if (deps['mysql2'] || deps['mysql']) databases.add('MySQL')
        if (deps['sqlite3']) databases.add('SQLite')
        if (deps['redis']) databases.add('Redis')

      } catch (err) {
        console.error('[TechDetectorService] Failed to parse package.json:', err.message)
      }
    }

    // 3. Deep scan requirements.txt content (Python ecosystem)
    const pythonRequirementsFile = filePaths.find(p => p.toLowerCase().endsWith('requirements.txt'))
    if (pythonRequirementsFile && files[pythonRequirementsFile].content) {
      const content = files[pythonRequirementsFile].content.toLowerCase()
      
      // Backend frameworks
      if (content.includes('django')) backend.add('Django')
      if (content.includes('flask')) backend.add('Flask')
      if (content.includes('fastapi')) backend.add('FastAPI')

      // Databases
      if (content.includes('psycopg2') || content.includes('postgres')) databases.add('PostgreSQL')
      if (content.includes('pymongo')) databases.add('MongoDB')
      if (content.includes('mysql-connector') || content.includes('mysqlclient')) databases.add('MySQL')
    }

    // 4. Deep scan pom.xml content (Java Maven ecosystem)
    const javaPomFile = filePaths.find(p => p.toLowerCase().endsWith('pom.xml'))
    if (javaPomFile && files[javaPomFile].content) {
      const content = files[javaPomFile].content.toLowerCase()

      // Backend frameworks
      if (content.includes('spring-boot')) backend.add('Spring Boot')

      // Databases
      if (content.includes('mysql-connector')) databases.add('MySQL')
      if (content.includes('postgresql')) databases.add('PostgreSQL')
    }

    // 5. Fallback defaults if no base language was mapped
    if (languages.size === 0) {
      // Default to JavaScript if we have JS source mappings
      const hasJsFiles = filePaths.some(p => p.endsWith('.js') || p.endsWith('.jsx'))
      if (hasJsFiles) {
        languages.add('JavaScript')
      } else {
        // Fallback default
        languages.add('Unknown')
      }
    }

    return {
      languages: Array.from(languages),
      frontend: Array.from(frontend),
      backend: Array.from(backend),
      databases: Array.from(databases)
    }
  }
}

export default new TechDetectorService()
