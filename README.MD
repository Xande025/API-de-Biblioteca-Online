# Biblioteca Online API

Este é um projeto de API RESTful para uma Biblioteca Online, implementada com Node.js, Express, Prisma e MySQL. A API permite o cadastro de livros, gerenciamento de usuários, controle de segurança, autenticação, e outras funcionalidades relacionadas a uma biblioteca digital.

## Tecnologias Utilizadas
- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework para construção de APIs.
- **Prisma**: ORM utilizado para interagir com o banco de dados MySQL.
- **MySQL**: Banco de dados relacional.
- **TypeScript**: Superconjunto de JavaScript que adiciona tipagem estática opcional.
- **bcrypt**: Biblioteca para criptografia de senhas.
- **JWT (JSON Web Token)**: Utilizado para autenticação de usuários.
- **nodemailer**: Biblioteca para enviar e-mails de recuperação de senha e ativação de conta.

## Funcionalidades
### Usuários
- **Cadastro de Usuário**: Registra um novo usuário no sistema, iniciando com status `INATIVO` e enviando um e-mail de ativação.
- **Login**: Gera um token JWT para autenticar usuários registrados e ativados.
- **Recuperação de Senha**: Envia um código de recuperação para o e-mail do usuário e permite redefinir a senha.
- **Ativação de Conta**: Ativa a conta de um usuário por meio de um link enviado por e-mail.
- **Excluir Usuários**: Possibilidade de excluir todos os usuários (apenas para fins administrativos).

### Livros
- **Cadastro de Livro**: Cadastra livros associados aos usuários cadastrados.
- **Listagem de Livros**: Lista apenas os livros que não foram deletados (soft delete).
- **Alteração de Livro**: Permite a edição das informações de um livro.
- **Soft Delete de Livro**: Marca um livro como deletado sem removê-lo fisicamente do banco de dados.
- **Pesquisa de Livros**: Pesquisa por livros com base no título.

## Instalação e Configuração
1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu_usuario/biblioteca-online-api.git
   cd biblioteca-online-api
   ```
2. **Instale as dependências**:
   ```bash
   npm install
   ```
3. **Configure o Banco de Dados**:
   - Crie um banco de dados MySQL.
   - Configure o arquivo `.env` com a variável `DATABASE_URL` para apontar para o seu banco de dados MySQL.

4. **Rode as Migrações do Prisma**:
   ```bash
   npx prisma migrate dev --name init
   ```
5. **Inicie o Servidor**:
   ```bash
   npm run dev
   ```

## Arquivo `.env`
Você precisará criar um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:
```env
DATABASE_URL="mysql://user:password@localhost:3306/biblioteca_online"
JWT_KEY="sua_chave_secreta_para_jwt"
EMAIL_USER="seu_email@gmail.com"
EMAIL_PASS="sua_senha_de_app"
```

## Rotas da API
### Usuários
- **POST** `/usuarios` - Cadastra um novo usuário.
- **POST** `/usuarios/login` - Autentica o usuário e gera um token JWT.
- **POST** `/usuarios/recuperar-senha` - Envia um código de recuperação de senha para o e-mail do usuário.
- **POST** `/usuarios/redefinir-senha` - Redefine a senha usando o código de recuperação.
- **GET** `/usuarios/ativar/:hash` - Ativa a conta do usuário.
- **DELETE** `/usuarios` - Exclui todos os usuários.

### Livros
- **GET** `/livros` - Lista todos os livros não deletados.
- **POST** `/livros` - Cadastra um novo livro.
- **DELETE** `/livros/:id` - Marca um livro como deletado (soft delete).
- **PUT** `/livros/:id` - Atualiza todas as informações de um livro.
- **PATCH** `/livros/:id` - Atualiza alguns atributos de um livro.
- **GET** `/livros/pesquisa/:titulo` - Pesquisa livros pelo título.

## Soft Delete
Este projeto implementa um **Soft Delete** para livros. Quando um livro é "excluído", ele não é removido fisicamente do banco de dados, mas sim marcado como `deleted = true`. Dessa forma, os registros podem ser recuperados ou auditados futuramente.

## Autenticação
A autenticação é feita por meio de **JWT (JSON Web Tokens)**. Algumas rotas são protegidas e requerem um token válido no cabeçalho `Authorization` no formato `Bearer <token>`.

## Próximos Passos
- Implementar controle de acesso por nível de usuário (admin, editor, leitor, etc).
- Melhorar as verificações de segurança, como bloqueio após várias tentativas de login.
- Adicionar testes automatizados para as rotas principais.

## Contribuídores
<a href="https://github.com/Duduenri"><img src="https://github.com/Duduenri.png" width="45" height="45"></a> &nbsp;
<a href="https://github.com/Xande025"><img src="https://github.com/Xande025.png" width="45" height="45"></a> &nbsp;

## Licença
Este projeto é distribuído sob a licença MIT.

