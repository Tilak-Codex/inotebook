const mongoose = require('mongoose'); 
/*means you're importing the Mongoose library into your Node.js file.

require('mongoose') → loads the Mongoose package (which you installed using npm i mongoose)

const mongoose = → stores it in a variable so you can use it
*/
const mongoURI = "mongodb://iNoteBook:6TSVJWJwwUETSMLK@ac-v5lttbw-shard-00-00.zrbsurd.mongodb.net:27017,ac-v5lttbw-shard-00-01.zrbsurd.mongodb.net:27017,ac-v5lttbw-shard-00-02.zrbsurd.mongodb.net:27017/?ssl=true&replicaSet=atlas-pkexc2-shard-0&authSource=admin&appName=Cluster0";
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

module.exports=connectToMongo;
/*
is how you export a function from one file so it can be used in another file in Node.js.

odule.exports → object used to share things outside the file
connectToMongo → your function that connects to MongoDB

Eg for exporitng multiple functions 
module.exports = { connectToMongo, disconnectMongo };
*/
