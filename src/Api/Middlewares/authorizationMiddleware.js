const { verifyToken } = require('../../Utils/jwtSecret');
const { User, Role, Permission } = require('../Models/Association');
const UserLogService = require('../Services/UserLogService');
const useragent = require('useragent');
const geoip = require('geoip-lite');

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id, {
      include: [{
        model: Role,
        include: {
          model: Permission,
          through: { attributes: [] },
        },
      },],
    });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const role = user.Role;
    const permissions = role.Permissions
      ? role.Permissions.map((permission) => ({
        id: permission.id,
        name: permission.name,
      }))
      : [];

    // Extract user-agent details (browser, OS, device type)
    const agent = useragent.parse(req.headers['user-agent']);
    const deviceType = agent.device.family || 'desktop';
    const userAgent = `${agent.os.family} - ${agent.family}`;

    // Get location based on IP (may be approximate)
    const geo = geoip.lookup(ip);
    const location = geo ? `${geo.city}, ${geo.country}` : 'unknown';

    // Attach user and additional details to request

    req.user = {
      id: user.id,
      email: user.email,
      role: role.name,
      permissions: permissions,
    };
    req.user = decoded;
    req.token = token;
    req.ip = ip;
    req.user_info = user;
    req.auth_details = {
      ip_address: ip || '127.0.0.1',
      user_agent: userAgent || 'unknown',
      device_type: deviceType || 'desktop',
      location: location || 'unknown',
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message });
  }
};

module.exports = authMiddleware;
