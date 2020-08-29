const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

const PORT = process.env.PORT || 8080;

const app = express();
const authRouter = require('./routes/auth');

// Register middleware
app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);

if (process.env.NODE_ENV === 'production')
  app.use(express.static('client/build'));

// Connect To Database
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }, () => {
  console.log('mongoDB Connected');
});

app.listen(PORT);
