const express = require('express');
const route = express.Router();
const Caja = require('../models/Caja');
const Cheque = require('../models/Cheque');
const Cliente = require('../models/cliente');
const ConceptoLista = require('../models/ConceptoLista');
const Concepto = require('../models/concepto');
const { Op } = require('sequelize');

route.get('/', (req, res) => {
  Caja.findAll({
    include: [Cliente, Cheque],
    order: [['id_caja', 'ASC']],
  })
    .then(cajas => {
      res.json(cajas);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

route.get('/:id', (req, res) => {
  const id = req.params.id;
  Caja.findByPk(id, {
    include: [
      {
        model: Cliente,
        attributes: ['id_cliente', 'nombre', 'apellido']
      },
      Cheque,
      {
        model: ConceptoLista,
        include: [{
          model: Concepto,
          attributes: ['concepto']
        }]
      }
    ]
  })
    .then(caja => {
      res.json(caja);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

route.get('/filtro/fecha', (req, res) => {
  let { desde, hasta } = req.query;
  Caja.findAll({
    where: {
      fecha_fecha: {[Op.between] : [desde , hasta ]}
    },
    include: [Cliente, Cheque],
    order: [['id_caja', 'ASC']]
  }).then(cajas => {
    res.json(cajas);
  }).catch(err => {
    res.json(err);
  });
});

route.post('/', async (req, res) => {
  const {
    cliente,
    detalle,
    fecha,
    efectivo,
    transferencia,
    cheques
  } = req.body;
  await Caja.create({
    cliente_id_cliente: cliente,
    detalle: detalle,
    fecha_fecha: fecha,
    efectivo: efectivo,
    transferencia: transferencia,
    activo: true
  })
  .then(caja => {
    cheques.forEach(async el => {
      console.log(el);
      let cheque = await Cheque.findByPk(el.id_cheque);
      console.log(cheque);
      cheque.update({
        caja_id_caja: caja.id_caja
      });
      cheque.save();
    });
    res.json(caja);
  })
  .catch(err => {
    res.send('Error al cargar el comprobante de caja: ' + err)
  });
});

//Cerrar caja
route.patch('/:id', async (req, res) => {
  const id = req.params.id;
  const cajaAEditar = await Caja.findByPk(id);
  cajaAEditar.update({
    activo: false
  });
  cajaAEditar.save()
    .then(caja => {
      res.json(caja);
    })
    .catch(err => {
      res.send('Error al editar el comprobante de caja: ' + err)
    });
});

module.exports = route;