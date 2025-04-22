const express = require('express')
const router = express.Router()

const { loginUser, getProfile } = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')

// Rotas públicas
router.post('/login', loginUser)

// Rota protegida
router.get('/profile', authMiddleware, getProfile)

module.exports = router