const express = require('express')
const app = express()
const port = 8080

app.use('/test_stat', express.static('Client'))


app.use('/', express.static('./Client/User'));
app.use('/Common', express.static('./Client/Common'));
app.use('/Admin', express.static('./Client/Admin'));
app.use('/External', express.static('./Client/ExternalDependencies'));

  app.get('/api/tt', function (req, res) {
    res.send('GET sent to timetable API')
    console.log('GET sent to timetable API')
  })

  app.post('/api/tt', function (req, res) {
    res.send('POST request to timetable API')
    console.log('POST request to timetable API')
  })

  app.get('/api/feedback', function (req, res) {
    res.send('GET request to comment API')
    console.log('GET request to comment API')
  })

  app.post('/api/feedback', function (req, res) {
    res.send('POST request to comment API')
    console.log('POST request to comment API')
  })




  // 404 Error
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
  })


app.listen(port, () => console.log(`TT server listening on port ${port}!\nStatic access at: \\test_stat\\filename.js`))