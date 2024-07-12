const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

const app = express();
const httpServer = createServer(app);

const router = require('./router');
app.use(router);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('we have a new connection!!!');

  socket.on('join', ({name, room}, callback) => {
    console.log(name,room);

  })

  socket.on('disconnect', () => {
    console.log('User had left!!!');
  });
});

httpServer.listen(PORT, () => console.log(`Server has started on PORT: ${PORT}`));