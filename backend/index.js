require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./db');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello World!');  
});
// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 5050;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});