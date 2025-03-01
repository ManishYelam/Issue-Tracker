const jwt = require('jsonwebtoken');
const { JWT_CONFIG } = require('./constants');
const UserLog = require('../Api/Models/user_logs');
const Role = require('../Api/Models/Role');
const Permission = require('../Api/Models/Permission');
const User = require('../Api/Models/User');
const { Op } = require('sequelize');

const generateToken = (user, secret = JWT_CONFIG.SECRET) => {
  try {    
    return jwt.sign({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      date_of_birth: user.date_of_birth,
      phone_number: user.phone_number,
      address: user.address,
      status: user.status,
      isVerified: user.isVerified,
      permission_ids: user.permission_ids ?? [],
      user_metadata: user.user_metadata ?? {},
      role_info: user.Role
        ? {
          id: user.Role?.id,
          code: user.Role?.code,
          name: user.Role?.name,
          description: user.Role?.description,
          created_by: user.Role?.created_by,
          updated_by: user.Role?.updated_by,
          createdAt: user.Role?.createdAt,
          updatedAt: user.Role?.updatedAt,
        }
        : null,
    }, 
    secret, 
    {
      expiresIn: JWT_CONFIG.EXPIRATION,
      algorithm: 'HS256',
    });
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
    // console.log('JWT decoded without verification:', { decoded });
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

    if (!user) {
      throw new Error('User not found or already logged out');
    }

    user.logged_in_status = false;
    user.token = null;
    user.expiresAt = null;
    user.expiredAt = new Date();
    await user.save();

    return { success: true, message: 'Logout successful. Your session has been securely ended.', user };
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
