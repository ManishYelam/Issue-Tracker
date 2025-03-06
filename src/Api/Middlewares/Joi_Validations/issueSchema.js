const Joi = require("joi");
const { getAllLOVs } = require("../../Services/GenericServices");

// Dynamic Joi Schema for Upserting Issues
const createUpsertIssueSchema = async () => {
  // Fetch LOVs dynamically
  const statusLOVs = await getAllLOVs(["task_status"], true);
  const priorityLOVs = await getAllLOVs(["priority"], true);
  const issueTypeLOVs = await getAllLOVs(["issue_type"], true);
  const taskCategoryTypeLOVs = await getAllLOVs(["task_category"], true);
  const reproducibilityTypeLOVs = await getAllLOVs(["reproducibility"], true);
  const escalationLevelTypeLOVs = await getAllLOVs(["EscalationLevel"], true);

  // Extract 'code' values correctly
  const statusCodes = statusLOVs.map((lov) => lov.code);
  const priorityCodes = priorityLOVs.map((lov) => lov.code);
  const issueTypeCodes = issueTypeLOVs.map((lov) => lov.code);
  const taskCategoryTypeCodes = taskCategoryTypeLOVs.map((lov) => lov.code);
  const reproducibilityCodes = reproducibilityTypeLOVs.map((lov) => lov.code);
  const escalationLevelCodes = escalationLevelTypeLOVs.map((lov) => lov.code);

  return Joi.object({
    issue_id: Joi.number().integer().positive().optional(),
    user_id: Joi.number().integer().positive().required(),
    title: Joi.string().max(255).required(),
    description: Joi.string().required(),
    issue_type: Joi.string().valid(...issueTypeCodes).required(),
    priority: Joi.string().valid(...priorityCodes).default("Medium"),
    // status: Joi.string().valid(...statusCodes).default("PENDING"),
    category: Joi.string().valid(...taskCategoryTypeCodes).allow(null, ""),
    impact_area: Joi.string().max(255).allow(null, ""),
    reproducibility: Joi.string().valid(...reproducibilityCodes).default("Always"),
    root_cause: Joi.string().allow(null, ""),
    assigned_to: Joi.number().integer().positive().allow(null),
    reported_by: Joi.number().integer().positive().required(),
    resolved_by: Joi.number().integer().positive().allow(null),
    resolved_at: Joi.date().allow(null),
    due_date: Joi.date().allow(null),
    resolution_notes: Joi.string().allow(null, ""),
    attachments: Joi.array().items(Joi.string().uri()).allow(null),
    tags: Joi.array().items(Joi.string().max(1000000).allow(null, "")).allow(null),
    related_issues: Joi.array().items(Joi.number().max(1000000).allow(null, "")).allow(null),
    escalation_level: Joi.string().valid(...escalationLevelCodes).default("None"),
    escalated_to: Joi.number().integer().positive().allow(null),
    workaround: Joi.string().allow(null, ""),
    estimated_effort: Joi.number().integer().positive().allow(null),
    actual_effort: Joi.number().integer().positive().allow(null),
    deployment_required: Joi.boolean().default(false),
  });
};

// **Dynamic Joi Schema for Updating Status**
const createUpdateStatusSchema = async () => {
  const statusLOVs = await getAllLOVs(["task_status"], true);
  const statusCodes = statusLOVs.map((lov) => lov.code);

  return Joi.object({
    status: Joi.string().valid(...statusCodes).required(),
  });
};

// **Function to Validate Data Using Dynamic LOVs**
const validateWithLOVs = async (schemaFunction, data) => {
  const dynamicSchema = await schemaFunction();
  return dynamicSchema.validate(data, { abortEarly: false });
};

module.exports = { createUpsertIssueSchema, createUpdateStatusSchema, validateWithLOVs };
