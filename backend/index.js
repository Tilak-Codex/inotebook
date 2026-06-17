const connectToMong = require('./db'); 
/*
connectTMongo is a object that holds the function exported from db.js. By requiring './db', you are importing the function(s) that connects to MongoDB, allowing you to use it in this file.

*/
connectToMong();
const User=require('./models/User');
const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000

app.use(cors())
app.use(express.json()); //Adds a middleware to parse incoming JSON requests, making the data available in req.body.
//w.o it req.body = undefined

//Available Routes
app.use("/api/auth",require("./routes/auth"));
app.use("/api/notes",require("./routes/notes"));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})