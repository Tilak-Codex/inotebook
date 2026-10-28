const connectToMongo = require('./db');
require('dotenv').config();

connectToMongo();

const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://inotebook-delta-flame.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      } else {
        return callback(null, true); // Fallback allow in development
      }
    },
    credentials: true,
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
