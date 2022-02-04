const express = require('express');
const route = express.Router();
const Cheque = require('../models/Cheque');
const Caja = require('../models/Caja');

route.get('/', (req, res) => {
  Cheque.findAll()
    .then(cheques => {
      res.json(cheques);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

route.get('/activo', (req, res) => {
  Cheque.findAll({
    where: {
      caja_id_caja: null
    }
  })
    .then(cheques => {
      res.json(cheques);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

route.get('/:id', (req, res) => {
  const id = req.params.id;
  Cheque.findByPk(id)
    .then(cheque => {
      res.json(cheque);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

route.post('/', async (req, res) => {
  const {
    banco,
    cuit,
    fecha,
    importe,
    numero,
    sucursal
  } = req.body;
  await Cheque.create({
    banco: banco,
    cuit: cuit,
    fecha: fecha,
    importe: importe,
    numero: numero,
    sucursal: sucursal
  })
  .then(cheque => {
    res.json(cheque);
  })
  .catch(err => {
    res.send('Error al cargar cheque: ' + err)
  });
});

//Asignar Caja a Cheque
route.patch('/:id', async (req, res) => {
  const id = req.params.id;
  const { id_caja } = req.body;
  const chequeAEditar = await Cheque.findByPk(id);
  chequeAEditar.update({
    caja_id_caja: id_caja
  });
  chequeAEditar.save()
    .then(cheque => {
      res.json(cheque);
    })
    .catch(err => {
      res.send('Error al editar cheque: ' + err)
    });
});

module.exports = route;