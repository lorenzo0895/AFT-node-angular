const { DataTypes } = require('sequelize');
const sequelize = require('./sequalize');

const Fecha = sequelize.define("fecha", {
  fecha: {
    type: DataTypes.DATEONLY,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  activo: DataTypes.BOOLEAN,
  sobrante: DataTypes.FLOAT,
  name_file: DataTypes.STRING
}, {
  freezeTableName: false,
  tableName: 'fecha',
  timestamps: false
}
);

module.exports = Fecha;