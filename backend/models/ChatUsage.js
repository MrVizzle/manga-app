const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatUsageSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
  date: { type: Date, required: true },
  count: { type: Number, default: 0 },
});

chatUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

const chatUsage = mongoose.model('chatUsage', chatUsageSchema);
module.exports = chatUsage;