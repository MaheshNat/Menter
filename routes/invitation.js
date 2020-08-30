const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Invitation = require('../models/Invitation');
const User = require('../models/User');

router.post('/send', auth, (req, res) => {
  const { subject, userId, type } = req.body;
  if (!(subject && userId && type))
    return res.status(400).json({ message: 'INVALID_REQUEST_BODY' });
  User.findById(req.user.id)
    .then((data) => {
      if (
        data.outgoingInvitations.some(
          (outgoingInvitation) => outgoingInvitation.userId == userId
        )
      )
        return res
          .status(400)
          .json({ message: 'Invitation has already been sent.' });
      User.findByIdAndUpdate(req.user.id, {
        $push: {
          outgoingInvitations: new Invitation({
            subject: subject,
            userId: userId,
            type: type,
          }),
        },
      }).then((data) => {
        User.findByIdAndUpdate(userId, {
          $push: {
            incomingInvitations: new Invitation({
              subject: subject,
              userId: req.user.id,
              type: type,
            }),
          },
        }).then((data) => {
          res.status(201).json({ message: 'Sent invitation.' });
        });
      });
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

router.post('/accept', auth, (req, res) => {
  const { invitationId } = req.body;
  if (!invitationId)
    return res.status(400).json({ message: 'INVALID_REQUEST_BODY' });
  let invitation = null;
  User.findById(req.user.id)
    .then((data) => {
      for (let incomingInvitation of data.incomingInvitations) {
        if (incomingInvitation._id == invitationId) {
          invitation = incomingInvitation;
        }
      }
      if (invitation === null)
        return res.status(400).json({ message: 'Invitation does not exist.' });
      User.findByIdAndUpdate(req.user.id, {
        $pull: { incomingInvitations: invitation },
        $push: { scheduledMeetings: invitation },
      }).then((data) => {
        User.findByIdAndUpdate(invitation.userId, {
          $pull: {
            outgoingInvitations: { userId: req.user.id },
          },
          $push: {
            scheduledMeetings: new Invitation({
              _id: invitationId,
              subject: invitation.subject,
              type: invitation.type,
              userId: req.user.id,
            }),
          },
        }).then((data) => {
          res.status(201).json({ message: 'Accepted invitation.' });
        });
      });
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

router.post('/cancel', auth, (req, res) => {
  const { invitationId } = req.body;
  if (!invitationId) res.status(400).json({ message: 'INVALID_REQUEST_BODY' });
  let invitation = null;
  User.findById(req.user.id)
    .then((data) => {
      for (let outgoingInvitation of data.outgoingInvitations) {
        if (outgoingInvitation._id == invitationId) {
          invitation = outgoingInvitation;
        }
      }
      if (invitation === null)
        return res.status(400).json({ message: 'Invitation does not exist.' });
      User.findByIdAndUpdate(req.user.id, {
        $push: { cancelledInvitations: invitation },
        $pull: { outgoingInvitations: invitation },
      }).then((data) => {
        User.findByIdAndUpdate(invitation.userId, {
          $pull: {
            incomingInvitations: { userId: req.user.id },
          },
          $push: {
            cancelledInvitations: new Invitation({
              subject: invitation.subject,
              type: invitation.type,
              userId: req.user.id,
            }),
          },
        }).then((data) => {
          res.status(201).json({ message: 'Cancelled invitation' });
        });
      });
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

router.post('/deny', auth, (req, res) => {
  const { invitationId } = req.body;
  if (!invitationId) res.status(400).json({ message: 'INVALID_REQUEST_BODY' });
  let invitation = null;
  User.findById(req.user.id)
    .then((data) => {
      for (let incomingInvitation of data.incomingInvitations) {
        if (incomingInvitation._id == invitationId) {
          invitation = incomingInvitation;
        }
      }
      if (invitation === null)
        return res.status(400).json({ message: 'Invitation does not exist.' });
      User.findByIdAndUpdate(req.user.id, {
        $pull: { incomingInvitations: invitation },
        $push: { cancelledInvitations: invitation },
      }).then((data) => {
        User.findByIdAndUpdate(invitation.userId, {
          $pull: {
            outgoingInvitations: { userId: req.user.id },
          },
          $push: {
            cancelledInvitations: new Invitation({
              subject: invitation.subject,
              type: invitation.type,
              userId: req.user.id,
            }),
          },
        }).then((data) => {
          res.status(201).json({ message: 'Denied invitation' });
        });
      });
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

router.post('/complete', auth, (req, res) => {
  const { meetingId, rating } = req.body;
  if (!meetingId || !rating)
    res.status(400).json({ message: 'INVALID_REQUEST_BODY' });
  let meeting = null;
  User.findById(req.user.id).then((data) => {
    for (let scheduledMeeting of data.scheduledMeetings) {
      if (scheduledMeeting._id == meetingId) {
        meeting = scheduledMeeting;
      }
    }
    if (meeting === null)
      return res.status(400).json({ message: 'Meeting does not exist.' });
    User.findByIdAndUpdate(req.user.id, {
      $pull: { scheduledMeetings: meeting },
      $push: { completedMeetings: meeting },
    })
      .then((data) => {
        User.findById(meeting.userId).then((data) => {
          User.findByIdAndUpdate(meeting.userId, {
            $pull: {
              scheduledMeetings: { userId: req.user.id },
            },
            $push: {
              completedMeetings: meeting,
            },
            $set: {
              rating: (data.rating * data.ratings + rating) / (data.rating + 1),
            },
            $inc: {
              ratings: 1,
            },
          }).then((data) => {
            res.status(200).json({ message: 'Completed meeting.' });
          });
        });
      })
      .catch((err) => {
        res.json({ message: err });
      });
  });
});

module.exports = router;
