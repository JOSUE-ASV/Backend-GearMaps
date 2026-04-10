require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes"); // Seu arquivo de rotas revisado

const app = express();

app.use(cors());
app.use(express.json());

// 🚀 A MUDANÇA: Use "/" em vez de "/users"
// Assim, as rotas internas de userRoutes comandam o caminho final.
app.use("/", userRoutes);

// Opcional: Uma rota de teste para saber se o servidor está online no Pop!_OS
app.get("/status", (req, res) => {
  res.json({ status: "GearMaps Server Running 🏎️💨" });
});

module.exports = app;
