import { body, validationResult } from 'express-validator'

/**
 * Validator schema for repository analysis requests.
 * Validates that the body contains a field named 'url' which must be a valid public GitHub URL.
 */
export const validateRepositoryUrl = [
  body('url')
    .trim()
    .notEmpty()
    .withMessage('Repository URL is required.')
    .isURL({ require_tld: true, require_protocol: true })
    .withMessage('Please provide a valid URL format including protocol (e.g. https://).')
    .custom((value) => {
      // Regex checking if the URL points to a public github repository
      const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+(\/)?$/
      if (!githubRegex.test(value)) {
        throw new Error('URL must be a valid public GitHub repository (e.g., https://github.com/user/repo).')
      }
      return true
    }),

  // Middleware function to intercept and report validation errors
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      })
    }
    next()
  }
]
