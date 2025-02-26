const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const { User } = require('./Association');

const ApplicationPropAttribute = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  property_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  property_value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
};

const ApplicationProperties = sequelize.MAIN_DB_NAME.define(
  'ApplicationProperties',
  ApplicationPropAttribute,
  {
    tableName: 'tbl_application_properties',
    indexes: [
      {
        unique: true,
        fields: ['property_name', 'property_value'],
      },
    ],
    timestamps: true,
  }
);

module.exports = ApplicationProperties;
