import gitService from '../services/gitService.js'

/**
 * Controller to handle codebase repository analysis.
 * 
 * @route POST /api/repository/analyze
 * @desc Receive a public GitHub URL, clone the repository locally, and return status.
 */
export const analyzeRepository = async (req, res, next) => {
  try {
    const { url } = req.body

    // Trigger the repository cloning service
    const { localPath, isDuplicate } = await gitService.cloneRepository(url)

    // For Milestone 4, we return the status of the cloning operation.
    // In the next milestones, we will parse the files inside localPath.
    return res.status(200).json({
      success: true,
      repository: url,
      localPath,
      isDuplicate
    })
  } catch (error) {
    // If the clone fails (e.g. repo doesn't exist, network error), catch it here
    next(error)
  }
}
