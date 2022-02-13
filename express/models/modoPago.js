const { UUIDV4 , DataTypes } = require('sequelize');
const sequelize = require('./sequalize');

const ModoPago = sequelize.define("modo_pago", {
  id_medio_pago: {
    type: DataTypes.STRING,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  nombre: DataTypes.STRING
}, {
  freezeTableName: false,
  tableName: 'modo_pago',
  timestamps: false
}
);

module.exports = ModoPago;