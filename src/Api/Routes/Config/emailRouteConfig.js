const { sendRegistrationEmail, sendPasswordChangeEmail, sendPerformanceTrackingEmail, sendSystemLogsEmail, sendNotificationEmail } = require("../../Controllers/email.Controller");

module.exports = [
  {
    method: 'post',
    path: '/send-registration-email/:userId',
    middlewares: [],
    controller: sendRegistrationEmail,
  },
  {
    method: 'post',
    path: '/send-password-change-email/:userId',
    middlewares: [],
    controller: sendPasswordChangeEmail,
  },
  {
    method: 'post',
    path: '/send-performance-tracking-email/:userId',
    middlewares: [],
    controller: sendPerformanceTrackingEmail,
  },
  {
    method: 'post',
    path: '/send-system-logs-email/:userId',
    middlewares: [],
    controller: sendSystemLogsEmail,
  },
  {
    method: 'post',
    path: '/send-notification-email/:userId',
    middlewares: [],
    controller: sendNotificationEmail,
  },
];
