const { verifyToken } = require('../../Utils/jwtSecret');
const useragent = require('useragent');
const geoip = require('geoip-lite');
const { User, Role, Permission } = require('../../Api/Models/Association');

const authMiddleware = async (socket, next) => {
  try {
    const token =
      socket.handshake.query.token || socket.handshake.auth?.token || socket.handshake.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new Error('Unauthorized: No token provided');
    }

    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          include: {
            model: Permission,
            through: { attributes: [] },
          },
        },
      ],
    });

    if (!user) {
      throw new Error('Unauthorized: User not found');
    }

    const userAgentHeader = socket.handshake.headers['user-agent'] || 'unknown';
    const agent = useragent.parse(userAgentHeader);
    const deviceType = agent.device.family || 'desktop';
    const userAgent = `${agent.os.family || 'unknown'} - ${agent.family || 'unknown'}`;

    const ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address || '127.0.0.1';
    const geo = geoip.lookup(ip);
    const location = geo ? `${geo.city || 'unknown'}, ${geo.country || 'unknown'}` : 'unknown';

    socket.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    socket.token = token;
    socket.ip = ip;
    socket.authDetails = {
      ip_address: ip,
      user_agent: userAgent,
      device_type: deviceType,
      location: location,
    };

    console.log('Socket authentication successful for:', socket.user);
    next();
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    next(new Error('Authentication failed: ' + error.message));
  }
};

module.exports = authMiddleware;
