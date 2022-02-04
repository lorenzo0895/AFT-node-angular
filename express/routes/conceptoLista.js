const express = require('express');
const route = express.Router();
const ConceptoLista = require('../models/ConceptoLista');
const Caja = require('../models/Caja');
const { Op } = require('sequelize');
const Concepto = require('../models/concepto');
const Cliente = require('../models/cliente');

route.get('/', (req, res) => {
  ConceptoLista.findAll()
    .then(conceptos => {
      res.json(conceptos);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

route.get('/:id', (req, res) => {
  const id = req.params.id;
  ConceptoLista.findByPk(id)
    .then(concepto => {
      res.json(concepto);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

route.get('/filtro/fecha', (req, res) => {
  let { desde, hasta } = req.query;
  ConceptoLista.findAll({
    include: [{
      model: Caja,
      where: {
        fecha_fecha: {[Op.between] : [desde , hasta ]}
      },
      attributes: ['id_caja', 'fecha_fecha', 'cliente_id_cliente'],
      include: [Cliente],
      order: [['fecha_fecha', 'ASC']]
    }, {
      model: Concepto,
      attributes: ['concepto']
    }]
  }).then(conceptos => {
    res.json(conceptos);
  }).catch(err => {
    console.log(err);
    res.json(err);
  });
});

route.post('/', async (req, res) => {
  const {
    concepto,
    importe,
    caja
  } = req.body;
  await ConceptoLista.create({
    concepto_id_concepto: concepto,
    importe: importe,
    caja_id_caja: caja,
    pagado: false
  })
    .then(concepto => {
      res.json(concepto);
    })
    .catch(err => {
      res.send('Error al guardar concepto: ' + err);
    });
});

//cambia atributo 'pagado' por true o false
route.patch('/:id', async (req, res) => {
  const id = req.params.id;
  const { fecha_pago } = req.body;
  //Ver de guardar comprobante
  const conceptoAEditar = await ConceptoLista.findByPk(id)
    .catch(err => {
      res.send(err);
      return;
    });
  if (conceptoAEditar.pagado) {
    //Sacamos el Pago
    conceptoAEditar.update({
      pagado: false,
      fecha_pago: null,
      comprobante_location: null
    }).catch(err => {
      res.send('Error al actualizar concepto;');
      return;
    });
  } else {
    //Pagamos
    conceptoAEditar.update({
      pagado: true
    }).catch(err => {
      res.send('Error al actualizar concepto;');
      return;
    });
  }
  conceptoAEditar.save()
    .then(concepto => {
      res.json(concepto);
    })
    .catch(err => {
      res.send('Error al guardar concepto: ' + err);
    });
});

module.exports = route;