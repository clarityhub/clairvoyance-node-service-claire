const Sequelize = require('sequelize');
const sequelize = require('../../services/sequelize');

/**
 * Turn off logging for seeders
 */
sequelize.options.logging = false;

const queryInterface = sequelize.getQueryInterface();

module.exports = (exec) => {
  return exec(queryInterface, Sequelize);
};
