const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');

const ContactsAttribute = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
const Contacts = sequelize.MAIN_DB_NAME.define('Contacts', ContactsAttribute, {
  tableName: 'tbl_contacts',
  timestamps: true,
});

module.exports = Contacts;
