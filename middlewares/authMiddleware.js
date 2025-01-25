const jwt = require('jsonwebtoken');
const checkBlacklist = require('./blacklistMiddleware');

const authMiddleware = async (req, res, next) => {
    // const token = req.header('Authorization'); //This line formate is wrong
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        await checkBlacklist(req, res, () => {});  // Check if the token is blacklisted

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
