const Server = use('Server')
const io = use('socket.io')(Server.getInstance())
const BotController = use('App/Controllers/Http/BotController')
const Covid19Controller = use('App/Controllers/Http/Covid19Controller')
// const DialogFlowController = use('App/Controllers/Http/DialogFlowController')

io.on('connection', function (socket) {
  console.log(socket.id)
  socket.on('bot-chat', async (data) => {

      const botController = new BotController
      try {
        let response = await botController.v2Bot({data})
        console.log('pass', response)
        io.emit('bot-chat', response);
      }catch(err){
        console.log(err)
      }
  });
  socket.on('c19-summary-global', async (data) => {
    console.log(data)
    const covid19Controller = new Covid19Controller
      try {
        let response = await covid19Controller.c19SummaryGlobal({data})
        io.emit('c19-summary-global', response);
      }catch(err){
        console.log(err)
      }
  });
  socket.on('c19-current-country', async (data) => {
    console.log(data)
    const covid19Controller = new Covid19Controller
      try {
        let response = await covid19Controller.c19CurrentCountry({data})
        io.emit('c19-current-country', response);
      }catch(err){
        console.log(err)
      }
  });

socket.on('c19-summary-countries', async (data) => {
  console.log(data)
  const covid19Controller = new Covid19Controller
    try {
      let response = await covid19Controller.c19SummaryCountries({data})
      io.emit('c19-summary-countries', response);
    }catch(err){
      console.log(err)
    }
});

  // socket.on('covid19-api-country-status', async (data) => {
  //   const covid19Controller = new Covid19Controller
  //     try {
  //       let response = await covid19Controller.c19CountryAndStatus({data})
  //       console.log('covid-pass', response)
  //       io.emit('covid19-api-country-status', response);
  //     }catch(err){
  //       console.log(err)
  //     }
  // });
})

