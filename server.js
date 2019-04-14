const app = require('./Server/app')
const port = 80

/* *********************************
   *         Start server          *
   ********************************* */
  app.listen(port, () => console.log(`Timetable server started on port: ${port}`))