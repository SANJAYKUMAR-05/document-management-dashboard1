module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);

    socket.on('disconnect', () => {
      console.log('Socket disconnected', socket.id);
    });

    socket.on('client_upload_progress', (data) => {
      io.emit('upload_progress', data);
    });
  });
};
