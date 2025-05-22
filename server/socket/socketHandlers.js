const connectedUsers = new Map();

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    // User joins with their ID
    socket.on('login', (userId) => {
      connectedUsers.set(userId, socket.id);
      console.log(`User ${userId} connected with socket ${socket.id}`);
    });

    // User sends a message
    socket.on('sendMessage', ({ chatId, message, receiver }) => {
      const receiverSocketId = connectedUsers.get(receiver);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', {
          chatId,
          message
        });
      }
    });

    // User is typing
    socket.on('typing', ({ chatId, user, receiver }) => {
      const receiverSocketId = connectedUsers.get(receiver);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('userTyping', {
          chatId,
          user
        });
      }
    });

    // User stops typing
    socket.on('stopTyping', ({ chatId, receiver }) => {
      const receiverSocketId = connectedUsers.get(receiver);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('userStoppedTyping', {
          chatId
        });
      }
    });

    // User disconnects
    socket.on('disconnect', () => {
      let disconnectedUserId = null;
      
      connectedUsers.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
        }
      });
      
      if (disconnectedUserId) {
        connectedUsers.delete(disconnectedUserId);
        console.log(`User ${disconnectedUserId} disconnected`);
      }
      
      console.log('Client disconnected');
    });
  });
};