const Blacklist = require('../models/blacklistModel');

//Blacklist schema
const checkBlacklist = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        const isBlacklisted = await Blacklist.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token is blacklisted. Please log in again.' });
        }
    }
    next();
};

module.exports = checkBlacklist;
