const Server = use('Server')
const io = use('socket.io')(Server.getInstance())
const BotController = use('App/Controllers/Http/BotController')

io.on('connection', function (socket) {
  console.log(socket.id)
  socket.on('bot_chat', (data) => {

      const botController = new BotController
      let response = botController.chat({data})
      if(response) {
        io.emit('bot-chat', response);
      }
  });
})

