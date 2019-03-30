const express = require('express')
const app = express()
const port = 8080

app.use('/test_stat', express.static('Client'))
app.get('/', (req, res) => res.send('You need to implement some real routing!!!'))

app.listen(port, () => console.log(`TT server listening on port ${port}!\nStatic access at: \\test_stat\\filename.js`))