const express = require('express');
const route = express.Router();
const Cliente = require('../models/cliente');

route.get('/', (req, res) => {
  Cliente.findAll({
    order: [['apellido', 'ASC']],
  })
    .then(clientes => {
      res.json(clientes);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

route.get('/activo', (req, res) => {
  Cliente.findAll({
    where: {
      activo: true
    },
    order: [['apellido', 'ASC']],
    attributes: ['id_cliente', 'apellido', 'nombre']
  })
    .then(clientes => {
      res.json(clientes);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

route.get('/:id', (req, res) => {
  const id = req.params.id;
  Cliente.findByPk(id)
    .then(cliente => {
      res.json(cliente);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

//------------- VER de acá para abajo

route.post('/', async (req, res) => {
  const { concepto } = req.body;
  await Cliente.create({ concepto: concepto })
    .then(cliente => {
      res.json(cliente);
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