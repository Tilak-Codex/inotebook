const connectToMongo = require('./db');
require('dotenv').config();

connectToMongo();

const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: ["Content-Type", "auth-token", "Authorization"]
  })
);

app.use(express.json());

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("iNoteBook Backend API is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
