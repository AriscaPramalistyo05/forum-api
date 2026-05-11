import AuthenticationError from '../../Commons/exceptions/AuthenticationError.js';
import config from '../../Commons/config.js';
import jwt from 'jsonwebtoken';

const buatAuthMiddleware = (container) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing authentication');
    }

    const token = authHeader.slice(7);
    try {
      const payload = jwt.verify(token, config.auth.accessTokenKey);
      req.user = payload;
    } catch {
      throw new AuthenticationError('Token tidak valid');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default buatAuthMiddleware;
