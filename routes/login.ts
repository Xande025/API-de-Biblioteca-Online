import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import bcrypt from 'bcrypt'

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})

const router = Router()

router.post("/login", async (req, res) => {
  const { email, senha } = req.body

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) {
      return res.status(401).json({ erro: "Usuário não encontrado" })
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha inválida" })
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    const ultimoLogin = usuario.ultimoLogin
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoLogin: new Date() }
    })

    const mensagem = ultimoLogin
      ? `Bem-vindo ${usuario.nome}. Seu último acesso ao sistema foi em ${ultimoLogin.toLocaleString()}`
      : `Bem-vindo ${usuario.nome}. Este é o seu primeiro acesso ao sistema`

    res.status(200).json({ token, mensagem })
  } catch (error) {
    res.status(500).json({ erro: "Erro ao fazer login" })
  }
})

export default router