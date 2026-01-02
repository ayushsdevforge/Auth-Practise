const jwt = require('jsonwebtoken');
const userSchema = require('../model/userModel');

const auth = async (req, res, next) => {
  try {
    const bearHeader = req.headers.authorization;

    if (!bearHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = bearHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = auth;