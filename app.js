const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv/config');

const PORT = process.env.PORT || 8080;

const app = express();
const authRouter = require('./routes/auth');
const invitationRouter = require('./routes/invitation');
const tradesRouter = require('./routes/trades');
const rateLimit = require('express-rate-limit');

const sslRedirect = (environments = ['production'], status = 302) => {
  const currentEnv = process.env.NODE_ENV;
  const isCurrentEnv = environments.includes(currentEnv);
  return (req, res, next) => {
    if (isCurrentEnv) {
      req.headers['x-forwarded-proto'] !== 'https'
        ? res.redirect(status, 'https://' + req.hostname + req.originalUrl)
        : next();
    } else next();
  };
};

const invitationLimiter = rateLimit({
  windowMs: parseInt(process.env.INVITATION_RATE_LIMITER_WINDOW) * 1000,
  max: parseInt(process.env.INVITATION_RATE_LIMITER_RATES),
  message: 'Too many invitations from this IP, please try again after an hour',
});

// Register middleware
app.use(sslRedirect());
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/invitation', invitationLimiter, invitationRouter);
app.use('/api/trades', tradesRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Connect To Database
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }, () => {
  console.log('mongoDB Connected');
});

app.listen(PORT);
