const express = require('express')
const router = express.Router()
const { createUser, getUsers, loginUser } = require('../controllers/userController')

// Rota de cadastro
router.post('/users', createUser)

// Rota de listagem
router.get('/users', getUsers)

// Rota de login
router.post('/login', loginUser)

module.exports = router