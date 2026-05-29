const path = require('path');
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB and models
const { sequelize } = require('./models');

// routes
const documentRoutes = require('./routes/documents');
const notificationRoutes = require('./routes/notifications');

app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// socket handlers
app.set('io', io);
require('./sockets')(io);

// sync database and start server
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connected and synced');

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();

module.exports = { app, server, io };
