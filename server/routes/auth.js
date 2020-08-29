const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/register', (req, res) => {
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
  } = req.body;
  if (!(firstName && lastName && age && grade && email && password))
    return res.status(400).json({ message: 'INCOMPLETE_REQUEST_BODY' });
  User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ message: 'USER_EXISTS' });
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
    if (!user) return res.status(400).json({ message: 'USER_DOES_NOT_EXIST' });
    // Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch)
        return res.status(400).json({ message: 'INVALID_CREDENTIALS' });
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

router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then((user) => {
      res.json(user);
    });
});

router.put('/user', auth, (req, res) => {
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
