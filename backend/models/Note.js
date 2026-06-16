// Refer (./models/User.js)

const mongoose = require('mongoose'); 
const  {Schema}  = mongoose;

const NotesSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        default: Date.now
    }
  
});

module.exports = mongoose.model("notes",NotesSchema);

/*
In a MERN stack project, the models directory is where you define the structure of your data — basically, how your data looks in the database.

A model = a blueprint for your data.

A model defines:

What fields your data will have
Their data types
Any validations (required, unique, etc.)

*/