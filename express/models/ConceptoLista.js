const { DataTypes, UUIDV4 } = require('sequelize');
const Concepto = require('./concepto');
const sequelize = require('./sequalize');

const ConceptoLista = sequelize.define("concepto_lista", {
  id_concepto_lista: {
    type: DataTypes.UUIDV4,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  pagado: DataTypes.BOOLEAN,
  comprobante_location: DataTypes.STRING,
  importe: DataTypes.DOUBLE,
  fecha_pago: DataTypes.DATEONLY
}, {
  freezeTableName: false,
  tableName: 'concepto_lista',
  timestamps: false
}
);

ConceptoLista.belongsTo(Concepto, {targetKey:'id_concepto', foreignKey: 'concepto_id_concepto'});

module.exports = ConceptoLista;