import gitService from '../services/gitService.js'
import analyzerService from '../services/analyzerService.js'
import techDetectorService from '../services/techDetectorService.js'

/**
 * Controller to handle codebase repository analysis.
 * 
 * @route POST /api/repository/analyze
 * @desc Receive a public GitHub URL, clone locally, parse config files, detect technology stack, and return payload.
 */
export const analyzeRepository = async (req, res, next) => {
  try {
    const { url } = req.body

    // 1. Clone repository locally (or return local path if already cloned)
    const { localPath, isDuplicate } = await gitService.cloneRepository(url)

    // 2. Perform static analysis on the local clone (finding and reading target config files)
    const analysis = await analyzerService.analyzeCodebase(localPath)

    // 3. Auto-detect technologies and dependencies from config file contents
    const technologies = techDetectorService.detectTechnologies(analysis.files)

    // 4. Return the full validation, clone status, detected stack, and files payload
    return res.status(200).json({
      success: true,
      repository: url,
      isDuplicate,
      technologies,
      files: analysis.files
    })
  } catch (error) {
    // Catch-all to forward errors to Express global handler
    next(error)
  }
}
