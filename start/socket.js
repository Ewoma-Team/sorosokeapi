const Server = use('Server')
const io = use('socket.io')(Server.getInstance())
const BotController = use('App/Controllers/Http/BotController')
// const DialogFlowController = use('App/Controllers/Http/DialogFlowController')

io.on('connection', function (socket) {
  console.log(socket.id)
  socket.on('bot_chat', async (data) => {

      const botController = new BotController
      try {
        let response = await botController.v2Bot({data})
        console.log('pass', response)
        io.emit('bot-chat', response);
      }catch(err){
        console.log(err)
      }
  });
})

