const { UUIDV4 , DataTypes } = require('sequelize');
const sequelize = require('./sequalize');

const Usuario = sequelize.define("usuario", {
  id_usuario: {
    type: DataTypes.STRING,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true
  },
  fecha_alta: DataTypes.DATE,
  activo: DataTypes.BOOLEAN,
  nombre: DataTypes.STRING,
  password: DataTypes.STRING,
  permiso_abrir_dias: DataTypes.BOOLEAN,
  permiso_cerrar_dias: DataTypes.BOOLEAN,
  permiso_cerrar_modificaciones: DataTypes.BOOLEAN,
  permiso_ingresar: DataTypes.BOOLEAN,
  permiso_modificar: DataTypes.BOOLEAN,
  permiso_modificar_usuarios: DataTypes.BOOLEAN
}, {
  freezeTableName: false,
  tableName: 'usuario',
  timestamps: false
}
);

module.exports = Usuario;