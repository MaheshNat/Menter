const mongoose = require('mongoose');
const SkillSchema = mongoose.Schema({
  subject: { type: String, required: true },
  endorsementUserIds: [mongoose.Schema.ObjectId],
});
module.exports = mongoose.model('Skill', SkillSchema);
