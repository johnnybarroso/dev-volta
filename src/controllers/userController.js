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

async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId // veio do middleware!
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." })
    }

    return res.json(user)
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar perfil." })
  }
}


module.exports = {
  createUser,
  getUsers,
  loginUser,
  getProfile
}
