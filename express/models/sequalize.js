const { Sequelize } = require('sequelize');

module.exports = new Sequelize('estudio','root','root', {
  host: 'localhost',
  dialect: 'mysql'
});