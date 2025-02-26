const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const User = require('./User');

const founderAttribute = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  startup_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  industry: {
    type: DataTypes.ENUM("Tech", "Health", "Finance", "Education", "Retail", "Other"),
    allowNull: false,
  },
  number_of_employees: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stage: {
    type: DataTypes.ENUM("Ideation", "Validation", "Early Traction", "Scaling"),
    allowNull: false,
  },
  nature_of_business: {
    type: DataTypes.ENUM("Product", "Service", "Process"),
    allowNull: false,
  },
  revenue_model: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  unique_value_proposition: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  pitch_deck: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}

const Founder = sequelize.MAIN_DB_NAME.define('Founder', founderAttribute, {
  tableName: 'tbl_founders',
  timestamps: true,
});

module.exports = Founder;
