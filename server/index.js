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
const data = {};


httpServer.listen(3002, () => console.log(`Socket.io test running on port 3002`));

const io = new Server(httpServer, {
  cors: true,
  origins: ['http://localhost:3000']
});

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('join_room', (loginInfo) => {
    socket.join(loginInfo.room); // creates room with the name
    console.log(`${loginInfo.user} Joined Room:`, loginInfo.room);
  });

  socket.on('send_message', (res) => {
    if(data.hasOwnProperty(res.room)){
      data[res.room].push(res.content);
    } else {
      data[res.room] = [res.content];
    }
    socket.to(res.room).emit('receive_message', data[res.room]);
  });

  socket.on('disconnect', () => {
    console.log('USER DISCONNECTED')
  });
});
