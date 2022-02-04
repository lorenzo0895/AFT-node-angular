const express = require('express');
const route = express.Router();
const Concepto = require('../models/concepto');

route.get('/', (req, res) => {
  Concepto.findAll()
    .then(conceptos => {
      res.json(conceptos);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

route.get('/:id', (req, res) => {
  const id = req.params.id;
  Concepto.findByPk(id)
    .then(concepto => {
      res.json(concepto);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

route.post('/', async (req, res) => {
  const { concepto } = req.body;
  await Concepto.create({ concepto: concepto })
    .then(concepto => {
      res.json(concepto);
    })
    .catch(err => {
      res.send('Error al guardar concepto: ' + err);
    });
});

route.patch('/:id', async (req, res) => {
  const id = req.params.id;
  const { concepto } = req.body;
  const conceptoAEditar = await Concepto.findByPk(id);
  conceptoAEditar.update({
    concepto: concepto
  });
  conceptoAEditar.save()
  .then(concepto => {
    res.json(concepto);
  })
  .catch(err => {
    res.send('Error al guardar concepto: ' + err);
  });;
});

module.exports = route;