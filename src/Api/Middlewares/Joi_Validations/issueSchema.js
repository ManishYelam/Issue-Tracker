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
    title: Joi.string().max(255).required(),
    description: Joi.string().required(),
    issueType: Joi.string().valid(...issueTypeCodes).required(),
    priority: Joi.string().valid(...priorityCodes).default("Medium"),
    status: Joi.string().valid(...statusCodes).default("Pending"),
    category: Joi.string().valid(...taskCategoryTypeCodes).allow(null, ""),
    impactArea: Joi.string().max(255).allow(null, ""),
    reproducibility: Joi.string().valid(...reproducibilityCodes).default("Always"),
    rootCause: Joi.string().allow(null, ""),
    assignedTo: Joi.number().integer().positive().allow(null),
    reportedBy: Joi.number().integer().positive().required(),
    resolvedBy: Joi.number().integer().positive().allow(null),
    resolvedAt: Joi.date().allow(null),
    dueDate: Joi.date().allow(null),
    resolutionNotes: Joi.string().allow(null, ""),
    attachments: Joi.array().items(Joi.string().uri()).allow(null),
    tags: Joi.string().max(255).allow(null, ""),
    relatedIssues: Joi.string().max(255).allow(null, ""),
    escalationLevel: Joi.string().valid(...escalationLevelCodes).default("None"),
    escalatedTo: Joi.number().integer().positive().allow(null),
    workaround: Joi.string().allow(null, ""),
    estimatedEffort: Joi.number().integer().positive().allow(null),
    actualEffort: Joi.number().integer().positive().allow(null),
    deploymentRequired: Joi.boolean().default(false),
  });
};

// **Dynamic Joi Schema for Updating Status**
const createUpdateStatusSchema = async () => {
  const statusLOVs = await getAllLOVs(["status"], true);
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
