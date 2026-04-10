const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const setupLocationSockets = require("./src/sockets/LocationSocket");

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// Inicializa os eventos de WebSocket
setupLocationSockets(io);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
