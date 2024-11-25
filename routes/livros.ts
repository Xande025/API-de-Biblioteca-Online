import { Disponibilidade, PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'
import { verificaToken } from '../middlewares/verificaToken'

const prisma = new PrismaClient()
const router = Router()

const livroSchema = z.object({
  titulo: z.string(),
  autor: z.string().min(3,
    { message: "Autor deve ter, no mínimo, 3 caracteres" }),
  anoPublicacao: z.number().min(1500,
    { message: "Ano de publicação deve ser superior ou igual a 1500" }),
  preco: z.number().positive(
    { message: "Preço não pode ser negativo" }),
  genero: z.string().optional(),
  disponibilidade: z.nativeEnum(Disponibilidade).optional(),
  paginas: z.number().optional(),
  usuarioId: z.number()
})

router.get("/", async (req, res) => {
  try {
    const livros = await prisma.livro.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        titulo: true,
        autor: true,
        anoPublicacao: true,
        preco: true,
        genero: true,
        disponibilidade: true,
        paginas: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    })
    res.status(200).json(livros)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.post("/", verificaToken, async (req, res) => {
  const valida = livroSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  try {
    const livro = await prisma.livro.create({
      data: valida.data
    })
    res.status(201).json(livro)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.delete("/:id", verificaToken, async (req: any, res) => {
  const { id } = req.params

  try {
    const livro = await prisma.livro.delete({
      where: { id: Number(id) }
    })

    await prisma.log.create({
      data: { 
        descricao: `Exclusão do Livro: ${id}`, 
        complemento: `Funcionário: ${req.userLogadoNome}`,
        usuarioId: req.userLogadoId
      }
    })

    res.status(200).json(livro)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.delete("/usuarios", verificaToken, async (req, res) => {
  try {
    const usuarios = await prisma.usuario.deleteMany()
    res.status(200).json({ message: "Todos os usuários foram excluídos.", count: usuarios.count })
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", verificaToken, async (req, res) => {
  const { id } = req.params

  const valida = livroSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  try {
    const livro = await prisma.livro.update({
      where: { id: Number(id) },
      data: valida.data
    })
    res.status(201).json(livro)
  } catch (error) {
    res.status(400).json({ error })
  }
})

// quando quisermos alterar apenas algum/alguns atributo(s)
router.patch("/:id", async (req, res) => {
  const { id } = req.params

  const partialLivroSchema = livroSchema.partial()

  const valida = partialLivroSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  try {
    const livro = await prisma.livro.update({
      where: { id: Number(id) },
      data: valida.data
    })
    res.status(201).json(livro)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.get("/pesquisa/:titulo", async (req, res) => {
  const { titulo } = req.params
  try {
    const livros = await prisma.livro.findMany({
      where: { titulo: { contains: titulo } },
      select: {
        id: true,
        titulo: true,
        autor: true,
        anoPublicacao: true,
        preco: true,
        genero: true,
        disponibilidade: true,
        paginas: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    })
    res.status(200).json(livros)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

export default router
