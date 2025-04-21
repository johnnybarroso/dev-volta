require('dotenv').config()
const express = require('express')
const cors = require('cors')
const userRoutes = require('./src/routes/userRoutes')

const app = express()

app.use(cors())
app.use(express.json()) // importante: habilita req.body em JSON

app.use('/api', userRoutes)

app.get('/', (req, res) => {
  res.send('Servidor rodando!')
})

app.listen(3000, () => {
  console.log('🔥 Servidor rodando em http://localhost:3000')
})
