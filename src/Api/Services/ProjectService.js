const sequelize = require('../../Config/Database/sequelize.config');
const { Projects, Team, TeamMember } = require('../Models/Association');

exports.upsertProject = async data => {
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
};
