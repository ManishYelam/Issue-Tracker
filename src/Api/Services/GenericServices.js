const { Op } = require("sequelize");
const ListOfValues = require("../Models/List.Of.values");

module.exports = {
  // Create or Update List of Value using Upsert
  createOrUpdateLOV: async (data) => {
    const [lov, created] = await ListOfValues.upsert(data);
    return { lov, created };
  },

  // Get all List of Values (Optional: Filter by category)
  getAllLOVs: async (categories) => { 
    const whereClause = categories?.length ? { category: { [Op.in]: categories } } : {};
    return await ListOfValues.findAll({ where: whereClause });
  },

  // Get a List of Value by ID
  getLOVById: async (id) => {
    return await ListOfValues.findByPk(id);
  },

  // Soft Delete a List of Value (Set isActive to false)
  deleteLOV: async (id) => {
    const lov = await ListOfValues.findByPk(id);
    if (!lov) return null;

    await lov.update({ isActive: false });
    return lov;
  },
}