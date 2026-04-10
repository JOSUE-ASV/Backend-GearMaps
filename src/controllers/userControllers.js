const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// 1. REGISTRO DE USUÁRIO (Mantido com melhoria no retorno)
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Email já cadastrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword],
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 2. LOGIN DE USUÁRIO (Gera o token e retorna os dados do piloto)
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 3. BUSCA DE USUÁRIOS (Para a sua nova Aba Social)
// Esta rota permite procurar amigos pelo nome
const searchUsers = async (req, res) => {
  const { name } = req.query;
  const currentUserId = req.userId; // Assumindo que você tem um middleware de auth

  try {
    // Busca usuários que contenham parte do nome, ignorando maiúsculas/minúsculas
    // E não mostra o próprio usuário logado na busca
    const result = await db.query(
      "SELECT id, name, email FROM users WHERE name ILIKE $1 AND id != $2 LIMIT 10",
      [`%${name}%`, currentUserId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
};

// 4. LISTAR USUÁRIOS (Padrão)
const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const result = await db.query(
      "SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset],
    );

    const countResult = await db.query("SELECT COUNT(*) FROM users");
    const totalItems = parseInt(countResult.rows[0].count);

    res.json({
      data: result.rows,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

module.exports = { register, login, getUsers, searchUsers };
