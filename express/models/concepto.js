const { UUIDV4 , DataTypes } = require('sequelize');
const sequelize = require('./sequalize');

const Concepto = sequelize.define("concepto", {
  id_concepto: {
    type: DataTypes.UUIDV4,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  concepto: DataTypes.STRING
}, {
  freezeTableName: false,
  tableName: 'concepto',
  timestamps: false
}
);

// Concepto.hasMany(ConceptoLista, {sourceKey: 'id_concepto', foreignKey: 'concepto_id_concepto'});

module.exports = Concepto;