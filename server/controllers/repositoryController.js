import gitService from '../services/gitService.js'
import analyzerService from '../services/analyzerService.js'
import techDetectorService from '../services/techDetectorService.js'
import treeService from '../services/treeService.js'

/**
 * Controller to handle codebase repository analysis.
 * 
 * @route POST /api/repository/analyze
 * @desc Receive a public GitHub URL, clone locally, parse config files, detect stack, generate file tree, and return payload.
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

    // 4. Generate the directory tree structure
    const tree = await treeService.generateRepoTree(localPath)

    // 5. Return the full validation, clone status, detected stack, file tree, and files payload
    return res.status(200).json({
      success: true,
      repository: url,
      isDuplicate,
      technologies,
      tree,
      files: analysis.files
    })
  } catch (error) {
    // Catch-all to forward errors to Express global handler
    next(error)
  }
}
