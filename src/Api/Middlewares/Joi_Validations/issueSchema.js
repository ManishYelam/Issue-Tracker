const Joi = require('joi');

const upsertIssueSchema = Joi.object({
  issue_id: Joi.number().integer().positive().optional(), // Optional for upsert (exists for update)
  title: Joi.string().max(255).required(),
  description: Joi.string().required(),
  issueType: Joi.string().valid('Bug', 'Feature Request', 'Task', 'Security', 'Performance').required(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
  status: Joi.string().valid('Pending', 'In Progress', 'On Hold', 'Resolved', 'To Be Tested', 'Tested', 'Commited', 'Rejected').default('Pending'),
  category: Joi.string().max(100).allow(null, ''),
  impactArea: Joi.string().max(255).allow(null, ''),
  reproducibility: Joi.string().valid('Always', 'Sometimes', 'Rarely', 'Cannot Reproduce').default('Always'),
  rootCause: Joi.string().allow(null, ''),
  assignedTo: Joi.number().integer().positive().allow(null),
  reportedBy: Joi.number().integer().positive().required(),
  resolvedBy: Joi.number().integer().positive().allow(null),
  resolvedAt: Joi.date().allow(null),
  dueDate: Joi.date().allow(null),
  resolutionNotes: Joi.string().allow(null, ''),
  attachments: Joi.array().items(Joi.string().uri()).allow(null), // Assuming URLs for attachments
  tags: Joi.string().max(255).allow(null, ''),
  relatedIssues: Joi.string().max(255).allow(null, ''),
  escalationLevel: Joi.string().valid('None', 'L1', 'L2', 'L3', 'Critical').default('None'),
  escalatedTo: Joi.number().integer().positive().allow(null),
  workaround: Joi.string().allow(null, ''),
  estimatedEffort: Joi.number().integer().positive().allow(null),
  actualEffort: Joi.number().integer().positive().allow(null),
  deploymentRequired: Joi.boolean().default(false),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid("Pending", "In Progress", "On Hold", "Resolved", "To Be Tested", "Tested", "Committed", "Rejected").required()
});

module.exports = { upsertIssueSchema, updateStatusSchema };
