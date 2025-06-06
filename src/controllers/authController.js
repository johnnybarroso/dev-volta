// 1. Importe o Prisma e o bcrupt

const prisma = require('../database/prismaClient')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//2. Crie a função loginUser com async
async function loginUser(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." })
    }

    const user = await prisma.user.findUnique({
        where: { email: email}
    })

    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado"})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Senha inválida."})
    }

    const token = jwt.sign({ userId: user.id}, 'secreto123', {expiresIn: '1h'})
    return res.json({ token })
}

//3. Pega o perfil para validação do token.
async function getProfile(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      })
  
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
      }
  
      return res.json(user)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar perfil' })
    }
  }

// 3. Exporte a função no final
module.exports = {
    loginUser,
    getProfile
}