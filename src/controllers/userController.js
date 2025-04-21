const prisma = require('../database/prismaClient')
const bcrypt = require('bcryptjs') // 👈 importa o bcrypt

async function createUser(req, res) {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return res.status(409).json({ error: 'E-mail já cadastrado.' })
  }

  // 🔐 Criptografa a senha antes de salvar
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword }
  })

  // 🔒 Retorna dados sem expor a senha
  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  })
}

async function getUsers(req, res) {
  const users = await prisma.user.findMany()
  return res.json(users)
}

module.exports = {
  createUser,
  getUsers
}
