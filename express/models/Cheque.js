const { DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('./sequalize');

const Cheque = sequelize.define("Cheque", {
  id_cheque: {
    type: DataTypes.STRING,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  banco: DataTypes.STRING,
  cuit: DataTypes.BIGINT,
  fecha: DataTypes.DATEONLY,
  importe: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  numero: DataTypes.STRING,
  sucursal: DataTypes.STRING
}, {
  freezeTableName: false,
  tableName: 'cheque',
  timestamps: false
}
);

module.exports = Cheque;