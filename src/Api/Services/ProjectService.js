const sequelize = require('../../Config/Database/sequelize.config');
const { Projects, Team, TeamMember, User, Role } = require('../Models/Association');

module.exports = {
  upsertProject: async data => {
    return await sequelize.MAIN_DB_NAME.transaction(async transaction => {
      let project;

      // ✅ Ensure project exists before updating
      if (data.project_id) {
        project = await Projects.findByPk(data.project_id, { transaction });

        if (!project) {
          throw new Error(`Project with ID ${data.project_id} does not exist.`);
        }

        await project.update(data, { transaction });
      } else {
        project = await Projects.create(data, { transaction });
      }

      let upsertedTeams = [];

      // ✅ Upsert Teams
      if (data.team && data.team.length > 0) {
        upsertedTeams = await Promise.all(
          data.team.map(async team => {
            if (!team.team_id) {
              throw new Error('team_id is required for updating an existing team.');
            }

            // ✅ Upsert Team
            let [updatedTeam] = await Team.upsert({ ...team, project_id: project.project_id }, { transaction, returning: true });

            let upsertedTeamMembers = [];

            // ✅ Use `findOrCreate` for Team Members
            if (team.team_members && team.team_members.length > 0) {
              upsertedTeamMembers = await Promise.all(
                team.team_members.map(async member => {
                  const [teamMember, created] = await TeamMember.findOrCreate({
                    where: { user_id: member.user_id, team_id: team.team_id },
                    defaults: {
                      joining_date: member.joining_date,
                      workload_percentage: member.workload_percentage,
                    },
                    transaction,
                  });

                  // ✅ If the member already exists, update relevant fields
                  if (!created) {
                    await teamMember.update(
                      {
                        joining_date: member.joining_date,
                        workload_percentage: member.workload_percentage,
                      },
                      { transaction }
                    );
                  }

                  return teamMember.get({ plain: true }); // ✅ Convert to raw JSON object
                })
              );
            }

            return {
              ...updatedTeam.get({ plain: true }),
              team_members: upsertedTeamMembers, // ✅ Attach upserted team members
            };
          })
        );
      }

      const projectResponse = {
        ...project.get({ plain: true }),
        teams: upsertedTeams,
      };

      return projectResponse;
    });
  },

  getProjectById: async project_id => {
    try {
      const project = await Projects.findByPk(project_id, {
        include: [
          {
            model: Team,
            as: 'teams',
            include: [
              {
                model: TeamMember,
                as: 'team_members',
                include: [
                  {
                    model: User,
                    as: 'user',
                    include: [
                      {
                        model: Role,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        raw: false, // ✅ Keeps Sequelize model instances
        nest: true, // ✅ Ensures correct nested JSON structure
      });

      if (!project) {
        throw new Error(`Project with ID ${project_id} not found`);
      }

      return project.get({ plain: true }); // ✅ Converts result to raw JSON
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getAllProjects: async ({ page = 1, limit = 10, filters = {}, search = "", searchFields = [] }) => {
    try {
      const offset = (page - 1) * limit;

      let whereConditions = {};

      // ✅ Apply dynamic filters
      Object.keys(filters).forEach((key) => {
        if (filters[key]) whereConditions[key] = filters[key];
      });

      // ✅ Apply dynamic search on specified fields
      if (search && searchFields.length > 0) {
        whereConditions[Op.or] = searchFields.map((field) => ({
          [field]: { [Op.like]: `%${search}%` },
        }));
      }

      // ✅ Fetch projects with pagination, filters, and search
      const { rows, count } = await Projects.findAndCountAll({
        where: whereConditions,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Team,
            as: "teams",
            include: [
              {
                model: TeamMember,
                as: "team_members",
                include: [
                  {
                    model: User,
                    as: "user",
                    include: [
                      {
                        model: Role,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        raw: false, // ✅ Keeps Sequelize model instances
        nest: true, // ✅ Ensures correct nested JSON structure
      });

      return {
        success: true,
        message: "✅ Projects fetched successfully.",
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data: rows,
      };
    } catch (error) {
      throw new Error(`❌ Error in getAllProjects: ${error.message}`);
    }
  },

};
