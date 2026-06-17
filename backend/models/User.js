/* Here we are creating schema for our user in the project,

Schema defines the sturcture of the data in mongo db

*/

const mongoose = require('mongoose');  //mongoose to control the mongo db (like jdbc) 

const  {Schema}  = mongoose; // imporing the schema from mongoose

/* Why const  {Schema}  = mongoose; not const  Schema  = mongoose;

mongosse contains many collections in it, but we need only Schema from it so latter syntax is used.

*/

// Creating UserSchema for the user collection in mongo db, and defining the fields in the collection with their data types and constraints
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    isVerified:{
        type: Boolean,
        default: false
    }
  
});

const User = mongoose.model("User", UserSchema); // creating a model named user with the defined schema
User.createIndexes(); // to create indexes for the unique fields in the schema (like email in this case)
module.exports = User;

// Here user is model name (we gave the model name user), and Userschema is the schema which the model user should obey