import express from 'express'
import { analyzeRepository } from '../controllers/repositoryController.js'
import { validateRepositoryUrl } from '../middleware/validation.js'

const router = express.Router()

// POST /api/repository/analyze - Analyze repo (clone, parse tech stack, tree, generate summary)
router.post('/analyze', validateRepositoryUrl, analyzeRepository)

export default router
