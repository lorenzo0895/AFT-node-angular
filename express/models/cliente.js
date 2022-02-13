const { UUIDV4 , DataTypes } = require('sequelize');
const sequelize = require('./sequalize');

const Cliente = sequelize.define("cliente", {
  id_cliente: {
    type: DataTypes.STRING,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  activo: DataTypes.BOOLEAN,
  apellido: DataTypes.STRING,
  nombre: DataTypes.STRING,
  clave_fiscal: DataTypes.STRING,
  cuit: DataTypes.BIGINT,
  mail: DataTypes.STRING,
  observaciones: DataTypes.STRING,
  posicion: DataTypes.STRING,
  telefono: DataTypes.STRING
}, {
  freezeTableName: false,
  tableName: 'cliente',
  timestamps: false
}
);

module.exports = Cliente;