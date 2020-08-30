const mongoose = require('mongoose');
const InvitationSchema = mongoose.Schema({
  subject: { type: String, required: true },
  userId: { type: mongoose.Schema.ObjectId, required: true },
  type: { type: String, required: true },
  flaggedId: mongoose.Schema.ObjectId,
});
module.exports = mongoose.model('Invitation', InvitationSchema);
