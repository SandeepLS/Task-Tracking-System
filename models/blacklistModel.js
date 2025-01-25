const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' }, // Auto-delete after 7 days
});

module.exports = mongoose.model('Blacklist', blacklistSchema);
