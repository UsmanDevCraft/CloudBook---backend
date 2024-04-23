const mongoConnection = require('./db');
const express = require('express')
var cors = require('cors')
mongoConnection();


const app = express()
app.use(cors())
const port = 5000

app.use(express.json());

app.use('/api/auth', require('./routes/auth'))
app.use('/api/note', require('./routes/note'))

app.get("", (req, res)=>{
  res.send("API is Working 😋");
})

app.listen(port, () => {
  console.log(`Cloudbook Backend listening on  http://localhost:${port}`)
})