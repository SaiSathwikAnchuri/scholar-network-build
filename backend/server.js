require('dotenv').config();
const connectDB = require("./src/config/db");
const app = require("./src/app");
const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});
app.set('io', io);

io.on('connection', (socket) => {
  const userId = socket.handshake.query.user_id;
  if (userId) socket.join(userId); // user-specific room
  socket.on("disconnect", () => {});
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server + WebSocket started on port ${PORT}`);
  });
});
