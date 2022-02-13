const Caja = require('../models/Caja');
const Cheque = require('../models/Cheque');
const ConceptoLista = require('../models/ConceptoLista');
const sequelize = require('../models/sequalize');

async function nuevaCaja(cliente, detalle, fecha, efectivo, transferencia, cheques) {

  try {
    const sumaCheques = cheques.reduce((acc, item) => {
      return acc + item.importe;
    }, 0);
    let sumaImportes = efectivo + transferencia + sumaCheques;
  
    if(sumaImportes === 0) {
      throw new Error('El ingreso de fondos no puede ser igual a cero');
    }

    await sequelize.transaction(async t => {
    const caja = await Caja.create({
      cliente_id_cliente: cliente,
      detalle: detalle,
      fecha_fecha: fecha,
      efectivo: efectivo,
      transferencia: transferencia,
      activo: true
    }, { transaction: t });

    cheques.forEach(cheque => {
      Cheque.findByPk(cheque.id_cheque).then(cheque => {
        cheque.update({
          caja_id_caja: caja.id_caja
        }).then(cheque => {
          cheque.save({transaction: t});
        });
      });
    });
  });
  } catch (error) {
    throw error;
  }
}

async function cerrarCaja(id) {
  const cajaAEditar = await Caja.findByPk(id, {
    include: [ConceptoLista, Cheque]
  });
  let sumaCaja = sumarTotal(cajaAEditar);
  let sumaConceptos = sumarConceptos(cajaAEditar);

  if (sumaCaja !== sumaConceptos) {
    throw new Error('La suma de conceptos no coincide con el total del Recibo.');
  }
  cajaAEditar.update({
    activo: false
  }).catch(err => {
    return err;
  });
  cajaAEditar.save().catch(err => {
    return err;
  });
  return cajaAEditar;
}

async function editarDetalle(id, detalle) {
  try {
    Caja.findByPk(id).then(caja => {
      caja.update({
        detalle: detalle
      }).then(caja => {
        caja.save();
      })
    })
  } catch (error) {
    throw new Error('No pudo actualizarse el detalle')
  }
}

function sumarConceptos(caja) {
  return caja.concepto_lista.reduce((acc, item) => {
    return acc + item.importe;
  }, 0);
}

function sumarTotal(caja) {
  const efectivo = caja.efectivo;
  const transferencia = caja.transferencia;
  const sumaCheques = caja.Cheques.reduce((acc, item) => {
    return acc + item.importe;
  }, 0);
  return efectivo + transferencia + sumaCheques;
}

module.exports = { cerrarCaja, nuevaCaja, editarDetalle };