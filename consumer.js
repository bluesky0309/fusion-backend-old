let isInitiator = false;

module.exports = function (io) {
  io.on("connection", (socket) => {
    const user_id = socket.handshake.query.user_id;

    // Log when a user connects and joins their room

    socket.join(user_id);

    socket.on("friend-request-accepted", (data) => {
      if (data.sender.user_id !== user_id) {

        // Join the sender's room
        socket.join(data.sender.user_id);

        // Emit the message to the sender's room
        socket.to(data.sender.user_id).emit("friend-request-accepted", {
          requestId: data.requestId,
          status: data.status,
        });

        // Leave the sender's room after emitting the message
        socket.leave(data.sender.user_id);
      }
    });

    socket.on("friend-start-chat", (data) => {
      if (data.senderId !== user_id) {

        // Join the sender's room
        socket.join(data.senderId);

        // Emit the message to the sender's room
        socket.to(data.senderId).emit("new-chat-received", data);

        // Leave the sender's room after emitting the message
        socket.leave(data.senderId);
      }
    });

    socket.on("sent-friend-request", (data) => {
      if (data.recipient.user_id !== user_id) {

        // Join the recipient's room
        socket.join(data.recipient.user_id);

        // Emit the message to the recipient's room
        socket.to(data.recipient.user_id).emit("received-friend-request", data);

        // Leave the recipient's room after emitting the message
        socket.leave(data.recipient.user_id);
      }
    });

    socket.on("typing", (data) => {
      let timeoutId;
      socket.to(data.room_id).emit("user-is-typing", {
        room_id: data.room_id,
      });

      timeoutId = setTimeout(() => {
        socket.to(data.room_id).emit("user-stoped-typing", {
          room_id: data.room_id,
        });
      }, 3000);
    });

    socket.on("join-room", (data) => {
      try {
        socket.join(data.room_id);
      } catch (error) {
        console.error("Error joining room:", error);
      }
    });

    socket.on("leave-room", (data) => {
      try {
        socket.leave(data.room_id);
      } catch (error) {
        console.error("Error leaving room:", error);
      }
    });

    socket.on("sent-direct-message", (message) => {
      io.in(message.dm_messages_id).emit("new-direct-message", message);
    });

    socket.on("sent-new-group-message", (message) => {
      io.in(message.groupId).emit("new-message-to-group", message);
    });

    socket.on("user-sent-message-to-community", (message) => {
      try {
        io.in(message.communityId).emit("new-message-to-community", message);
      } catch (error) {
        console.error("Error sending direct message:", error);
      }
    });

    socket.on("joined-via-invitation-group", (data) => {
      try {
        socket.join(data.groupId);
        io.to(data.groupId).emit("new-group-member", data);
      } catch (error) {
        console.error("Error joining group via invitation:", error);
      }
    });

    socket.on("joined-via-invitation-community", (data) => {
      try {
        socket.join(data.communityId);
        socket.to(data.communityId).emit("new-community-member", data);
      } catch (error) {
        console.error("Error joining community via invitation:", error);
      }
    });

    socket.on("joined-group", (group) => {
      try {
        socket.join(group.groupId);
      } catch (error) {
        console.error("Error joining group:", error);
      }
    });

    socket.on("sent-invite-group-request", (data) => {
      if (data.recipient.user_id !== user_id) {

        // Join the recipient's room
        socket.join(data.recipient.user_id);

        // Emit the message to the recipient's room
        socket
          .to(data.recipient.user_id)
          .emit("received-invite-group-request", data);

        // Leave the recipient's room after emitting the message
        socket.leave(data.recipient.user_id);
      }
    });

    // socket.on("call-user", (data) => {
    //   console.log("someone-is-comming");
    //   socket
    //     .to(data.room_id)
    //     .emit("someone-is-comming", { signal: data.signal });
    // });

    socket.on("user-answered-call", (data) => {
      socket.to(data.room_id).emit("call-answered", data.signal);
    });

    socket.on("call-user", (data) => {
      socket.to(data.room_id).emit("comming-user", data);
      socket.to(data.details.receiver.user_id).emit("comming-user", data);
    });

    socket.on("end-call", (data) => {
      socket.to(data.room_id).emit("caller-ended-call", data);
    });

    socket.on("reject-call", (data) => {
      socket.to(data.room_id).emit("call-rejected", data);
    });

    socket.on("answer-call", (data) => {
      socket.to(data.room_id).emit("call-answered", data);
    });

    // Handle disconnect event
    socket.on("disconnect", () => {
    });
  });
};
