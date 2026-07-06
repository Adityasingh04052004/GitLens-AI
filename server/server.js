import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware Configurations
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Permit client access
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json()) // Parser for JSON payloads

// Base Diagnostic Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GitLens AI Backend is operational',
    timestamp: new Date().toISOString()
  })
})

// Catch-all route handler for undefined endpoints
app.use('*', (req, res, next) => {
  const error = new Error(`Resource not found: ${req.originalUrl}`)
  error.status = 404
  next(error)
})

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500
  console.error(`[Error] ${err.message}`)
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  })
})

// Start Server Listen
app.listen(PORT, () => {
  console.log(`[Server] Operational on http://localhost:${PORT}`)
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`)
})
