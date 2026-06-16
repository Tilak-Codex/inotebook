const mongoose = require('mongoose'); 
/*means you're importing the Mongoose library into your Node.js file.

require('mongoose') → loads the Mongoose package (which you installed using npm i mongoose)

const mongoose = → stores it in a variable so you can use it
*/
const mongoURI = "mongodb://localhost:27017/inotebook" //Connection String 
const connectToMongo=()=>{
    mongoose.connect(mongoURI);
    console.log('Connected to Mongo');
}

module.exports=connectToMongo;
/*
is how you export a function from one file so it can be used in another file in Node.js.

odule.exports → object used to share things outside the file
connectToMongo → your function that connects to MongoDB

Eg for exporitng multiple functions 
module.exports = { connectToMongo, disconnectMongo };
*/
