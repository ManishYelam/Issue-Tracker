const Joi = require('joi');
const { getAllLOVs } = require('../../Services/GenericServices');

const generateProjectSchema = async (isUpdate = false) => {
  const projectStatusLOVs = await getAllLOVs(['ProjectStatus'], true);
  const projectPriorityLOVs = await getAllLOVs(['ProjectPriority'], true);

  const projectStatusCodes = projectStatusLOVs.map(lov => lov.code.toLowerCase());
  const projectPriorityCodes = projectPriorityLOVs.map(lov => lov.code.toLowerCase());

  return Joi.object({
    ...(isUpdate
      ? {
          status: Joi.string()
            .valid(...projectStatusCodes)
            .optional(),
        } // Status can be updated but not required
      : { project_name: Joi.string().max(200).required() }), // Name is required when creating
    description: Joi.string().max(1000).optional(),
    owner_id: Joi.number().integer()[isUpdate ? 'optional' : 'required'](),
    client_name: Joi.string().max(1000).optional(),
    start_date: Joi.date().iso()[isUpdate ? 'optional' : 'required'](),
    end_date: Joi.date().iso().greater(Joi.ref('start_date')).optional(),
    priority: Joi.string()
      .valid(...projectPriorityCodes)
      [isUpdate ? 'optional' : 'required'](),
    budget: Joi.number().min(0).optional(), // Budget should be a positive number
    progress_percentage: Joi.number().min(0).max(100).optional(), // 0-100% progress
    metadata: Joi.object().pattern(Joi.string(), Joi.any()).optional(),

    // ✅ Corrected team field with proper Joi validation
    team: Joi.array()
      .items(
        Joi.object({
          team_id: Joi.string().uuid().required(),
          team_name: Joi.string().max(255).required(),
          description: Joi.string().max(1000).optional(),
          project_id: Joi.string().uuid().required(),
          created_by: Joi.number().integer().optional(),
          team_lead_id: Joi.number().integer().required(),
          team_type: Joi.string().valid('Development', 'QA', 'Design', 'Operations').required(),
          communication_channel: Joi.string().max(255).optional(), // e.g., Slack, Teams

          // ✅ Fixed team_members structure
          team_members: Joi.array()
            .items(
              Joi.object({
                team_member_id: Joi.string().uuid().required(),
                user_id: Joi.number().integer().required(),
                joining_date: Joi.date().iso().optional(),
                workload_percentage: Joi.number().min(1).max(100).default(100), // 1-100% workload
              })
            )
            .optional(),
        })
      )
      .optional(),
  });
};

const createProjectSchema = () => generateProjectSchema(false);
const updateProjectSchema = () => generateProjectSchema(true);

module.exports = { createProjectSchema, updateProjectSchema };
