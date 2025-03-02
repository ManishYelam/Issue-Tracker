const os = require('os');
const { verifyToken } = require('../../Utils/jwtSecret');
const { User, Role, Permission } = require('../Models/Association');
const useragent = require('useragent');
const geoip = require('geoip-lite');

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const ip = (req.headers['x-forwarded-for']?.split(',')[0]) || req.socket.remoteAddress || req.connection.remoteAddress || req.ip;
  const user_agent = req.get('User-Agent');
  const agent = useragent.parse(req.headers['user-agent']);

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

    const deviceType = agent.device.family || 'desktop';

    const operating_system = {
      hostname: os.hostname(), // System name
      platform: os.platform(), // 'linux', 'darwin' (Mac), 'win32'
      os_type: os.type(), // 'Windows_NT', 'Linux', 'Darwin'
      os_version: os.release(), // OS version
      cpu_arch: os.arch(), // 'x64', 'arm', etc.
      total_memory: os.totalmem() / (1024 * 1024 * 1024) + ' GB',
      free_memory: os.freemem() / (1024 * 1024 * 1024) + ' GB',
      network_interfaces: os.networkInterfaces(), // Network details
    }

    req.user_info = decoded;
    req.token = token;
    req.operating_system = operating_system;
    req.auth_details = {
      ip_address: ip || '127.0.0.1',
      user_agent: user_agent || 'unknown',
      agent: agent,
      // location: location || 'unknown',
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message });
  }
};

module.exports = authMiddleware;
