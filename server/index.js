const express = require('express');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: true,
  origins: ['http://localhost:3000']
});

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('join_room', (roomName) => {
    socket.join(roomName); // creates room with the name
    console.log('User Joined Room:', roomName);
  })

  socket.on('disconnect', () => {
    console.log('USER DISCONNECTED')
  });
});

httpServer.listen(3002, () => console.log(`Socket.io test running on port 3002`))