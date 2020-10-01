const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const registerLimiter = rateLimit({
  windowMs: parseInt(process.env.REGISTER_RATE_LIMITER_WINDOW) * 1000,
  max: parseInt(process.env.REGISTER_RATE_LIMITER_RATES),
  message:
    'Too many accounts created from this IP, please try again after an hour',
});

const userLimiter = rateLimit({
  windowMs: parseInt(process.env.USER_RATE_LIMITER_WINDOW) * 1000,
  max: parseInt(process.env.USER_RATE_LIMITER_RATES),
  message:
    'Too many changes to account from this IP, please try again after an hour',
});

router.post('/register', registerLimiter, (req, res) => {
  const {
    firstName,
    lastName,
    age,
    grade,
    biography,
    email,
    password,
    skills,
    courses,
    needSkills,
    rating,
    ratings,
  } = req.body;
  console.log(req.body);
  if (!(firstName && lastName && age && grade && email && password))
    return res.status(400).json({ message: 'INCOMPLETE_REQUEST_BODY' });
  User.findOne({ email }).then((user) => {
    if (user)
      return res.status(400).json({
        message: 'User already exists. If you have an account, you can login.',
      });
  });
  const newUser = new User({
    firstName,
    lastName,
    age,
    grade,
    email,
    password,
    ...(courses && { courses }),
    ...(biography && { biography }),
    ...(skills && { skills }),
    ...(needSkills && { needSkills }),
    ...(rating && { rating }),
    ...(ratings && { ratings }),
  });

  //Create salt and hash
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser
        .save()
        .then((user) => {
          jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  age: user.grade,
                  email: user.email,
                },
              });
            }
          );
        })
        .catch((err) => console.log(err));
    });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (!user)
      return res.status(400).json({
        message: 'User does not exist. Please register before logging in.',
      });
    // Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch)
        return res.status(400).json({ message: 'Invalid credentials.' });
      jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
        }
      );
    });
  });
});

router.get('/learn-users', auth, (req, res) => {
  const _getScore = (__user, user) => {
    let score = 0;
    for (let needSkill of user.needSkills) {
      if (__user.skills.map((skill) => skill.subject).includes(needSkill))
        score += 2.5;
    }

    score += __user.rating ? __user.rating : 0;
    score += __user.completedMeetings ? __user.completedMeetings : 0;
    return score;
  };
  User.findById(req.user.id).then((user) => {
    User.find({}).then((data) => {
      data.sort((a, b) => _getScore(b, user) - _getScore(a, user));
      res.json(data);
    });
  });
  // .catch((err) => res.json({ message: err }));
});

router.get('/teach-users', auth, (req, res) => {
  const getScore = (_user, user) => {
    let score = 0;
    for (let skill of user.skills.map((skill) => skill.subject)) {
      if (_user.needSkills.includes(skill)) score += 2.5;
    }

    score += _user.rating ? _user.rating : 0;
    score += _user.completedMeetings ? _user.completedMeetings : 0;
    return score;
  };
  User.findById(req.user.id)
    .then((user) => {
      User.find({}).then((data) => {
        data.sort((_a, _b) => getScore(_b, user) - getScore(_a, user));
        res.json(data);
      });
    })
    .catch((err) => res.json({ message: err }));
});

router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then((user) => {
      res.json(user);
    });
});

router.post('/names', auth, (req, res) => {
  User.find({
    _id: {
      $in: req.body.ids.map((id) => mongoose.Types.ObjectId(id)),
    },
  }).then((users) => {
    let names = {};
    users.forEach((user) => {
      names[user._id] = user.firstName + ' ' + user.lastName;
    });
    res.json(names);
  });
});

router.put('/user', userLimiter, auth, (req, res) => {
  const { biography, skills, courses, needSkills } = req.body;
  User.updateOne(
    { _id: req.user.id },
    {
      $set: {
        ...(biography && { biography }),
        ...(skills && { skills }),
        ...(courses && { courses }),
        ...(needSkills && { needSkills }),
      },
    }
  )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

module.exports = router;
