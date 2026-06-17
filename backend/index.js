const connectToMong = require('./db');
require('dotenv').config();

connectToMong();

const express = require('express');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend-domain.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});