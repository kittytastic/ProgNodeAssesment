/* eslint-env node */

const app = require('./Server/app');
const port = 8080;

/* *********************************
   *         Start server          *
   ********************************* */
app.listen( process.env.PORT || port /*, () => console.log(`Timetable server started on port: ${port}`)*/);