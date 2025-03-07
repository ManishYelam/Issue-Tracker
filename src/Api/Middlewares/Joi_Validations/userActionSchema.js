const Joi = require('joi');

const issueHistorySchema = Joi.object({
  issue_history_id: Joi.number().integer().positive(),
  issue_id: Joi.number().integer().positive().required(),
  user_id: Joi.number().integer().positive().required(),
  changeDescription: Joi.string().required(),
  action_type: Joi.string().valid('create', 'update', 'view', 'delete').required(),
  details: Joi.object(),
  ip_address: Joi.string()
    .ip({ version: ['ipv4', 'ipv6'] })
    .allow(null),
  user_agent: Joi.string().allow(null),
  device_type: Joi.string().valid('desktop', 'mobile', 'tablet').allow(null),
  before_status: Joi.string()
    .valid('Pending', 'In Progress', 'On Hold', 'Resolved', 'To Be Tested', 'Tested', 'Commited', 'Rejected')
    .required(),
  after_status: Joi.string()
    .valid('Pending', 'In Progress', 'On Hold', 'Resolved', 'To Be Tested', 'Tested', 'Commited', 'Rejected')
    .required(),
  comment_text: Joi.string().allow(null),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});

module.exports = issueHistorySchema;
