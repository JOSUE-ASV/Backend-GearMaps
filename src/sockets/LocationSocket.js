const jwt = require("jsonwebtoken");
require("dotenv").config();

const locations = {};

module.exports = (io) => {
  // 1. O MIDDLEWARE DE SEGURANÇA
  io.use((socket, next) => {
    // Tenta pegar o token enviado pelo celular
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Erro: Token não fornecido."));
    }

    try {
      // Descriptografa o token usando a mesma senha do .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Pendura as informações do usuário no objeto do socket
      socket.user = decoded;
      next(); // Libera a conexão!
    } catch (err) {
      return next(new Error("Erro: Token inválido ou expirado."));
    }
  });

  // 2. EVENTOS (Agora com segurança garantida)
  io.on("connection", (socket) => {
    console.log(`📡 Usuário conectado: ${socket.user.name} (${socket.id})`);

    // Note que o frontend não manda mais o userId, manda só as coordenadas
    socket.on("sendLocation", ({ coords }) => {
      // Pegamos o ID diretamente da assinatura digital (à prova de fraudes)
      const userId = socket.user.id;

      locations[userId] = {
        id: userId,
        name: socket.user.name,
        coords,
      };

      const formatted = Object.values(locations);
      io.emit("receiveLocations", formatted);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Usuário desconectado: ${socket.user.name}`);
      // No futuro, podemos remover o pino dele do mapa aqui quando ele fechar o app
    });
  });
};
