const prisma = require('../database/prismaClient')
const bcrypt = require('bcryptjs')
const { loginUser } = require('./authController')

async function createUser(req, res) {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return res.status(409).json({ error: 'E-mail já cadastrado.' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  return res.status(201).json(user)
}

async function getUsers(req, res) {
  const users = await prisma.user.findMany()
  return res.json(users)
}

module.exports = {
  createUser,
  getUsers,
  loginUser
}
