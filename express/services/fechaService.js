const Fecha = require('../models/fecha');
const Caja = require('../models/Caja');
const Cheque = require('../models/Cheque');

async function nuevaFecha(fecha) {
  //REVISAMOS QUE LA FECHA SEA DEL DÍA DE HOY
  if (!isToday(fecha)) {
    throw new Error('El día ingresado no coincide con la fecha actual');
  }

  //REVISAMOS QUE NO SE HAYA CARGADO LA FECHA.
  const duplicada = await Fecha.findByPk(fecha).catch(error => {
    throw new Error('No se pudo hacer la consulta a la base de datos');
  });
  if (duplicada) {
    throw new Error('Ya existe un registro con la fecha seleccionada');
  }

  //REVISAMOS QUE TODOS LOS DÍAS ANTERIORES ESTÉN CERRADOS.
  let abiertos = await findOpened();
  if (abiertos.length > 0) {
    throw new Error('Deben cerrarse los días anteriores');
  }

  await Fecha.create({
    fecha: fecha,
    activo: true,
    sobrante: null
  }).catch(err => {
    throw new Error('No se pudo cargar la fecha en la base de datos');
  });
}

async function sumaDia(fecha) {
  const cajas = await Caja.findAll({
    where: {
      fecha_fecha: fecha
    },
    include: [Cheque]
  }).catch(err => {
    throw new Error('No se pudo consultar el total del día');
  });
  let suma = cajas.reduce((acc, item) => {
    let sumaCheques = item.Cheques.reduce((acc, item) => {
      return acc + item.importe;
    }, 0);
    return acc + item.efectivo + item.transferencia + sumaCheques;
  }, 0);
  return suma;
}

function isToday (fecha) {
  let offSet = new Date().getTimezoneOffset();
  let today = new Date();
  today.setMinutes(today.getMinutes() - offSet);
  let inputFecha = new Date(fecha);
  return (inputFecha.getUTCFullYear() === today.getUTCFullYear() &&
    inputFecha.getUTCMonth() === today.getUTCMonth() &&
    inputFecha.getUTCDate() === today.getUTCDate());
}

async function findOpened() {
  let abiertos = await Fecha.findAll({
    where: {
      activo: true
    }
  }).catch(error => {
    throw new Error('No se pudo hacer la consulta a la base de datos');
  });
  return abiertos;
}

module.exports = { nuevaFecha, findOpened, sumaDia };