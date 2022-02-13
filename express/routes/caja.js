const express = require('express');
const route = express.Router();
const Caja = require('../models/Caja');
const Cheque = require('../models/Cheque');
const Cliente = require('../models/cliente');
const ConceptoLista = require('../models/ConceptoLista');
const Concepto = require('../models/concepto');
const { Op } = require('sequelize');
const cajaService = require('../services/cajaService');

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
      fecha_fecha: { [Op.between]: [desde, hasta] }
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
  const { cliente, detalle, fecha, efectivo, transferencia, cheques } = req.body;
  try {
    await cajaService.nuevaCaja(cliente, detalle, fecha, efectivo, transferencia, cheques);
    res.json('Caja cargada correctamente');
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
});

//Cerrar caja
route.patch('/', async (req, res) => {
  const id = req.body.id;
  try {
    const caja = await cajaService.cerrarCaja(id);
    res.json(caja);
  } catch (error) {
    res.status(504).send({
      message: error.message
    });
  }
});

route.patch('/detalle', async (req, res) => {
  const { id, detalle } = req.body;
  console.log(id, detalle);
  try {
    const caja = await cajaService.editarDetalle(id, detalle);
    res.json(caja);
  } catch (error) {
    res.status(504).send({
      message: error.message
    });
  }
});

module.exports = route;