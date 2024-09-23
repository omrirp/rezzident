import jwt from 'jsonwebtoken';
import Account from '../models/account.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Middleware to authenticate requests using JWT
 */
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const account = await Account.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!account) {
      throw new Error();
    }

    next();
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'Token expired. Please log in again.' });
    }
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

export default auth;
