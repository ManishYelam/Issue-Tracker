const jwt = require('jsonwebtoken');
const { JWT_CONFIG } = require('./constants');
const UserLog = require('../Api/Models/user_logs');
const Role = require('../Api/Models/Role');
const Permission = require('../Api/Models/Permission');
const User = require('../Api/Models/User');
const { Op } = require('sequelize');

const generateToken = (user, secret = JWT_CONFIG.SECRET) => {
  const role = Role.findByPk(user.role_id, {
    include: {
      model: Permission,
      through: { attributes: ['id', 'name'] },
    },
  });
  const payload = {
    id: user.id,
    role: user.role,
    permissions: role.Permissions,
  };
  try {
    const token = jwt.sign(payload, secret, {
      expiresIn: JWT_CONFIG.EXPIRATION,
      algorithm: 'HS256',
    });
    return token;
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

const verifyToken = (token, secret = JWT_CONFIG.SECRET) => {
  try {
    const decoded = jwt.verify(token, secret);
    // console.log('JWT verified:', { userId: decoded.id });
    return decoded;
  } catch (error) {
    throw new Error('Token verification failed');
  }
};

const decodeToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded) {
      throw new Error('Invalid token format');
    }
    console.log('JWT decoded without verification:', { decoded });
    return {
      id: decoded.id,
      role: decoded.role,
    };
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    throw new Error('Token decoding failed');
  }
};

const refreshToken = (token, secret = JWT_CONFIG.SECRET) => {
  try {
    const decoded = jwt.verify(token, secret, { ignoreExpiration: true });
    const newToken = generateToken(decoded, secret);
    console.log('JWT refreshed:', { userId: decoded.id });
    return newToken;
  } catch (error) {
    console.error('Error refreshing JWT token:', error);
    throw new Error('Token refresh failed');
  }
};

const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      throw new Error('Invalid token format');
    }
    const isExpired = Date.now() >= decoded.exp * 1000;
    console.log('Token expiration status:', { isExpired });
    return isExpired;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

const blacklistToken = async (token) => {
  try {
    const decoded = decodeToken(token);  
    if (!decoded) {
      throw new Error('Invalid token format');
    }
    
    const user = await User.findOne({
      where: {
        id: decoded.id,
        logged_in_status: true,
        token: { [Op.ne]: null } // Ensures token is not null
      }
    });
    
    user.logged_in_status = false;
    user.token = null;
    user.expiresAt = null;
    user.expiredAt = new Date();
    await user.save();

    return { success: true, message: 'User found or logedout successfully', user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  refreshToken,
  isTokenExpired,
  blacklistToken
};
