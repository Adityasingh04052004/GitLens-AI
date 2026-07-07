import express from 'express'
import { analyzeRepository } from '../controllers/repositoryController.js'
import { validateRepositoryUrl } from '../middleware/validation.js'

const router = express.Router()

/**
 * Route mapping for repository endpoints.
 * All routes here are prefixed with /api/repository (when mounted in server.js)
 */

// POST /api/repository/analyze - Receive repo URL, validate, and return success payload
router.post('/analyze', validateRepositoryUrl, analyzeRepository)

export default router
