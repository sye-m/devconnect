const config = require('config');
const jwt = require('jsonwebtoken');
const jwtSecret = config.get('jwtSecret');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token found' });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.log(err);
        res.json(401).json({ msg: 'Invalid token' });
    }
};