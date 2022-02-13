const { DataTypes } = require('sequelize');
const Fecha = require('./fecha');
const Cliente = require('./cliente');
const sequelize = require('./sequalize');
const Cheque = require('./Cheque');
const ConceptoLista = require('./ConceptoLista');

const Caja = sequelize.define("caja", {
  id_caja: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  activo: DataTypes.BOOLEAN,
  detalle: DataTypes.STRING,
  efectivo: DataTypes.DOUBLE,
  transferencia: DataTypes.DOUBLE,
}, {
  freezeTableName: false,
  tableName: 'caja',
  timestamps: false
}
);

Caja.hasMany(Cheque, {sourceKey: 'id_caja', foreignKey: 'caja_id_caja'});
Caja.hasMany(ConceptoLista, {sourceKey: 'id_caja', constraints: false, foreignKey: 'caja_id_caja'});
ConceptoLista.hasOne(Caja, {sourceKey: 'caja_id_caja',  foreignKey: 'id_caja'});

Caja.belongsTo(Cliente, {targetKey:'id_cliente', foreignKey: 'cliente_id_cliente'});
Caja.belongsTo(Fecha, {targetKey:'fecha', foreignKey: 'fecha_fecha'});

module.exports = Caja;