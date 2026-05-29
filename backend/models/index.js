const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Document = require('./document')(sequelize, Sequelize.DataTypes);
const Notification = require('./notification')(sequelize, Sequelize.DataTypes);

module.exports = {
  sequelize,
  Sequelize,
  Document,
  Notification
};
