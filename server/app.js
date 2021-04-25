'use strict';
const express = require('express');
//  <------------- With Mongo DB -------------> const connectToMongodbAtlas = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const config = require('./config');
const couponRoutes = require('./routes/Coupon-routes');

//  <------------- With Mongo DB -------------> connectToMongodbAtlas();
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded( { extended: true } ))
app.use(cors({ withCredentials: false }));

app.use('/api', couponRoutes.routes);

const server = http.createServer(app);

const whitelist = ['http://localhost:4200'];

const io = socketIo(server, {
  cros: {
    origins: [whitelist],
    methods: ['GET', 'POST'],
    credentials: false,
  },
});

var count = 0;
io.on('connection', (socket) => {
  if (socket.handshake.headers.origin === 'http://localhost:4200') {
    count++;
    socket.broadcast.emit('count', count);

    console.log(count);

    socket.on('disconnect', () => {
      count--;
      socket.broadcast.emit('count', count);
      console.log(count);
    });
  }
  console.log('Client connected');
});

//  <------------- With Mongo DB -------------> const PORT = process.env.PORT || 8080;
const PORT = config.port;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));