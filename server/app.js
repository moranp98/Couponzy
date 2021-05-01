const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const couponRoutes = require('./routes/Coupon-routes');
const couponTypeRoutes = require('./routes/CouponType-routes');
const ReviewRoutes = require('./routes/Review-routes');
const StarRoutes = require('./routes/Star-routes');
const UserRoutes = require('./routes/User-routes');
const OrderRoutes = require('./routes/Order-routes');
const BranchRoutes = require('./routes/Branch-routes');
const ShopRoutes = require('./routes/Shop-routes');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded( { extended: true } ))
app.use(cors({ withCredentials: false }));

app.use('/api', couponRoutes.routes);
app.use('/api', couponTypeRoutes.routes);
app.use('/api', ReviewRoutes.routes);
app.use('/api', StarRoutes.routes);
app.use('/api', UserRoutes.routes);
app.use('/api', OrderRoutes.routes);
app.use('/api', BranchRoutes.routes);
app.use('/api', ShopRoutes.routes);

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

const PORT = process.env.PORT || 8080

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));