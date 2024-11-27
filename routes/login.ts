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

// Definindo a chave diretamente no código
const JWT_SECRET = "ChaveSecretaP4R4T0ken872387jsfk34esnmgdhkj*#@jfkM"

router.post("/login", async (req, res) => {
  const { email, senha } = req.body

  try {
    // Buscar o usuário pelo email
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) {
      return res.status(401).json({ erro: "Usuário não encontrado" })
    }

    // Validar a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha inválida" })
    }

    // Gerar o token JWT com a chave diretamente no código
    const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '1h' })

    // Atualizar o último login do usuário
    const ultimoLogin = usuario.ultimoLogin
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoLogin: new Date() }
    })

    // Mensagem de boas-vindas com base no último login
    const mensagem = ultimoLogin
      ? `Bem-vindo ${usuario.nome}. Seu último acesso ao sistema foi em ${ultimoLogin.toLocaleString()}`
      : `Bem-vindo ${usuario.nome}. Este é o seu primeiro acesso ao sistema`

    res.status(200).json({ token, mensagem })
  } catch (error) {
    res.status(500).json({ erro: "Erro ao fazer login" })
  }
})

export default router
