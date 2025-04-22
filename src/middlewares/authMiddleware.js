const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]
    if(!token) {
        return res.status(401).json({ error: "Token não fornecido." })
    }
    try {
        const decoded = jwt.verify(token, 'secreto123')
        req.userId = decoded.userId // salvar na requisição pra usar depois
        next() // permite seguir pra próxima rota
    } catch (error) {
        return res.status(401).json({ error: "Token inválido." })
    }
}

module.exports = authMiddleware


