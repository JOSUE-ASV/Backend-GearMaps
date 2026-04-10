# 🚀 GearMaps API & Real-time Server

Esta é a espinha dorsal do ecossistema GearMaps. Uma API REST robusta integrada com WebSockets para processamento de localização em tempo real e gestão de utilizadores.

## 🛠️ Tecnologias e Ferramentas

- **Node.js & Express**: Framework base da aplicação.
- **Socket.io**: Motor de comunicação bidirecional para eventos em tempo real.
- **PostgreSQL**: Base de dados relacional para persistência de dados.
- **JWT (JSON Web Tokens)**: Autenticação de rotas protegidas.
- **Bcrypt**: Criptografia de palavras-passe.
- **PM2**: Gestão de processos em ambiente de produção (AWS).

## 📌 Funcionalidades

- Autenticação de utilizadores (Login/Registo).
- Gestão de conexões via Socket para partilha de coordenadas.
- Procura de utilizadores para rede social de amigos.
- Infraestrutura preparada para deploy em instâncias AWS EC2 e bases de dados RDS.

## ⚙️ Instalação e Uso

1. Clone o repositório.
2. Crie um arquivo `.env` com as suas credenciais (DB_USER, DB_PASS, JWT_SECRET).
3. Execute `npm install`.
4. Inicie o servidor com `npm start` ou `pm2 start app.js`.

---

💡 **Nota:** Este servidor comunica diretamente com o [GearMaps Mobile](link-do-seu-repo-mobile).
