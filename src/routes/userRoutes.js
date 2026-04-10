const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");

// 1. Rota de Autenticação (Login)
// No AuthContext usamos: api.post("/auth/login", ...)
router.post("/auth/login", userController.login);

// 2. Rota de Registro (Cadastro)
// No RegisterScreen usamos: api.post("/auth/register", ...)
router.post("/auth/register", userController.register);

// 3. Rota de Busca (Aba Social)
// No SocialScreen usamos: api.get("/auth/search?name=...")
// Note: Eu adicionei 'auth' no prefixo para indicar que precisa de login
router.get("/users/search", userController.searchUsers);

// 4. Listagem Geral (Padrão)
router.get("/users", userController.getUsers);

module.exports = router;
