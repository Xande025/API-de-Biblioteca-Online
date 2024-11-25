import express from 'express';
import livrosRouter from './routes/livros';
import usuariosRouter from './routes/usuarios';
import loginRouter from './routes/login';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/livros', livrosRouter);
app.use('/usuarios', usuariosRouter);
app.use('/login', loginRouter);

app.get('/', (req, res) => {
  res.send('API de Biblioteca Online');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});