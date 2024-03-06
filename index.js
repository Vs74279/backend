const connectToMongo = require('./db');
const express = require('express');
connectToMongo();
const app = express()
app.use(express.json())



const port = 3000



app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/notes', require('./routes/notes.js'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

