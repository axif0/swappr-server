const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6001;
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());

// mongodb configuration using mongoose

mongoose
  .connect(
    `mongodb+srv://muhamadasif570:ami_ki_parbo_baiyaaa@cluster0-swap-course.wwr2nma.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(
    console.log("MongoDB Connected Successfully!")
  )
  .catch((error) => console.log("Error connecting to MongoDB", error));

  // jwt authentication
  app.post('/jwt', async(req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1hr'
    })
    res.send({token});
  })

const userRoutes = require('./api/routes/userRoutes');
const swapRequestRoutes = require('./api/routes/SwapRequestRoutes');
const studentInfoRoutes = require('./api/routes/studentInfoRoutes');
app.use('/studentInfo', studentInfoRoutes);


app.use('/users', userRoutes);
app.use('/swap', swapRequestRoutes);


app.get("/", (req, res) => {
  res.send("Hello swappi Client Server!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  
});
