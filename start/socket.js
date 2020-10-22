const Server = use('Server')
const io = use('socket.io')(Server.getInstance())
const ChatController = use('App/Controllers/Http/ChatController')

io.on('connection', function (socket) {
  console.log(socket.id)
  let socketId = socket.id
  //Socket is connected here
  let leavers = '';

  socket.on("user-join", async (data) => {
      this.username = data.username;
      socket.broadcast.emit("user-join", data);
  });

  socket.on('chat-message', async (data) => {//Receive a socket message from this action
      const chatController = new ChatController
      console.log(data)
      
      try {
        let response = await chatController.chat({data})

        //Possibly to a particular group
        socket.broadcast.emit('chat-message', response);// Emit back to user the data that came from the client socket

      }catch(err){
        console.log(err)
      }
  });

  socket.on('user-leave', async (data) => {
    socket.broadcast.emit("user-leave", this.username);
  })

  //Trigger the creed feed controller and fire result response


})

const socketIoObject = io;
module.exports.ioObject = socketIoObject;

