const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

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
  User.findById(req.user.id)
    .then((user) => {
      const getScore = (_user) => {
        let score = 0;
        for (let needSkill of user.needSkills) {
          let highestSimilarity = -1;
          for (let skill of _user.skills.map((s) => s.subject)) {
            let _similarity = similarity(skill, needSkill);
            if (_similarity > highestSimilarity)
              highestSimilarity = _similarity;
          }
          score += highestSimilarity;
        }
        score += _user.rating ? _user.rating : 0;
        score += _user.completedMeetings ? _user.completedMeetings : 0;
        return score;
      };
      User.find({}).then((data) => {
        data.sort((a, b) => getScore(b) - getScore(a));
        res.json(data);
      });
    })
    .catch((err) => res.json({ message: err }));
});

router.get('/teach-users', auth, (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      const getScore = (_user) => {
        let score = 0;
        for (let skill of user.skills.map((s) => s.subject)) {
          let highestSimilarity = -1;
          for (let needSkill of _user.needSkills) {
            let _similarity = similarity(skill, needSkill);
            if (_similarity > highestSimilarity)
              highestSimilarity = _similarity;
          }
          score += highestSimilarity;
        }
        score += _user.rating ? _user.rating : 0;
        score += _user.completedMeetings ? _user.completedMeetings : 0;
        return score;
      };
      User.find({}).then((data) => {
        data.sort((a, b) => getScore(b) - getScore(a));
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
