const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

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
  socket.on('join', ({name, room}, callback) => {
    const { error, user } = addUser({ id:socket.id, name, room });

    if(error) return callback(error);

    socket.emit('message',{ user:'admin', text:`${user.name}, bem vindo ao chat: ${user.room}`})
    socket.broadcast.to(user.room).emit('message',{user:'admin', text:`${user.name}, entrou na sala`});
    
    socket.join(user.room);

    io.to(user.room).emit('roomData'), { room: user.room, users: getUsersInRoom(user.room) };

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message',{user:user.name, text: message});
    io.to(user.room).emit('roomData',{room:user.room, users: getUsersInRoom(user.room)});

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user){
      io.to(user.room).emit('message', {user:'admin', text:`${user.name} saiu da sala`})
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  });
});

httpServer.listen(PORT, () => console.log(`Server has started on PORT: ${PORT}`));