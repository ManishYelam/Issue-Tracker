const Joi = require('joi');
const { getAllLOVs } = require('../../Services/GenericServices');

// Dynamic Joi Schema for Upserting Issues
const createUpsertIssueSchema = async () => {
  // Fetch LOVs dynamically
  const statusLOVs = await getAllLOVs(['task_status'], true);
  const priorityLOVs = await getAllLOVs(['priority'], true);
  const issueTypeLOVs = await getAllLOVs(['issue_type'], true);
  const taskCategoryTypeLOVs = await getAllLOVs(['task_category'], true);
  const reproducibilityTypeLOVs = await getAllLOVs(['reproducibility'], true);
  const escalationLevelTypeLOVs = await getAllLOVs(['EscalationLevel'], true);

  // Extract 'code' values correctly
  const statusCodes = statusLOVs.map(lov => lov.code);
  const priorityCodes = priorityLOVs.map(lov => lov.code);
  const issueTypeCodes = issueTypeLOVs.map(lov => lov.code);
  const taskCategoryTypeCodes = taskCategoryTypeLOVs.map(lov => lov.code);
  const reproducibilityCodes = reproducibilityTypeLOVs.map(lov => lov.code);
  const escalationLevelCodes = escalationLevelTypeLOVs.map(lov => lov.code);

  return Joi.object({
    project_id: Joi.string().uuid().required(),
    issue_id: Joi.number().integer().positive().optional(),
    title: Joi.string().max(255).required(),
    description: Joi.string().required(),
    issue_type: Joi.string()
      .valid(...issueTypeCodes)
      .required(),
    priority: Joi.string()
      .valid(...priorityCodes)
      .default('Medium'),
    status: Joi.string()
      .valid(...statusCodes)
      .default('PENDING')
      .optional(),
    category: Joi.string()
      .valid(...taskCategoryTypeCodes)
      .allow(null, '')
      .optional(),
    impact_area: Joi.string().max(255).allow(null, '').optional(),
    reproducibility: Joi.string()
      .valid(...reproducibilityCodes)
      .default('Always')
      .optional(),
    root_cause: Joi.string().allow(null, '').optional(),
    user_id: Joi.number().integer().positive().required(),
    // reported_by: Joi.number().integer().positive().required().optional(),
    // resolved_by: Joi.number().integer().positive().allow(null),
    // resolved_at: Joi.date().allow(null),
    due_date: Joi.date().allow(null).optional(),
    resolution_notes: Joi.string().allow(null, '').optional(),
    attachments: Joi.array().items(Joi.string().uri()).allow(null),
    tags: Joi.array().items(Joi.string().max(1000000).allow(null, '')).optional(),
    steps: Joi.array()
      .items(Joi.object({ description: Joi.string().max(1000000).allow(null, '').required() }))
      .allow(null),
    related_issues: Joi.array().items(Joi.number().max(1000000).allow(null, '')).allow(null).optional(),
    escalation_level: Joi.string()
      .valid(...escalationLevelCodes)
      .default('None')
      .optional(),
    escalated_to: Joi.number().integer().positive().allow(null).optional(),
    workaround: Joi.string().allow(null, '').optional(),
    estimated_effort: Joi.number().integer().positive().allow(null).optional(),
    actual_effort: Joi.number().integer().positive().allow(null).optional(),
    deployment_required: Joi.boolean().default(false).optional(),
    environments: Joi.array().items(Joi.string().max(1000000).allow('', null)).required(),
    browsers: Joi.array().items(Joi.string().max(1000000).allow('', null)).required(),
  });
};

// **Dynamic Joi Schema for Updating Status**
const createUpdateStatusSchema = async () => {
  const statusLOVs = await getAllLOVs(['task_status'], true);
  const statusCodes = statusLOVs.map(lov => lov.code);

  return Joi.object({
    status: Joi.string()
      .valid(...statusCodes)
      .required(),
  });
};

// **Function to Validate Data Using Dynamic LOVs**
const validateWithLOVs = async (schemaFunction, data) => {
  const dynamicSchema = await schemaFunction();
  return dynamicSchema.validate(data, { abortEarly: false });
};

module.exports = { createUpsertIssueSchema, createUpdateStatusSchema, validateWithLOVs };
