const express = require('express');
const route = express.Router();
const Fecha = require('../models/fecha');
const multer = require('multer');
const Caja = require('../models/Caja');
const Cheque = require('../models/Cheque');
const service = require('../services/fechaService');

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './comprobantes-cierre')
  },
  filename: (req, file, cb) => {
    cb(null, req.body.fecha + '--' + file.originalname)
  }
});

const upload = multer({ storage: fileStorageEngine }).single('file');

route.get('/', (req, res) => {
  Fecha.findAll()
    .then(fechas => {
      res.json(fechas);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

route.get('/activo', async (req, res) => {
  try {
    const abiertos = await service.findOpened();
    res.json(abiertos);
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
});

route.get('/suma-dia/:fecha', async (req, res) => {
  const fecha = req.params.fecha;
  try {
    const suma = await service.sumaDia(fecha);
    res.json(suma);
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
});

route.get('/:id', (req, res) => {
  const id = req.params.id;
  Fecha.findByPk(id)
    .then(concepto => {
      res.json(concepto);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

route.post('/', async (req, res) => {
  const { fecha } = req.body;
  try {
    await service.nuevaFecha(fecha);
    res.end();
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
});

route.patch('/', upload, async (req, res) => {

  const { fecha, sobrante } = req.body;
  const fechaAEditar = await Fecha.findByPk(fecha);
  fechaAEditar.update({
    activo: false,
    sobrante: sobrante,
    name_file: req.hasOwnProperty('file') ? req.file.filename : null
  });
  fechaAEditar.save()
    .then(fecha => {
      res.json(fecha);
    })
    .catch(err => {
      res.send('Error al editar fecha: ' + err);
    });

});

route.post('/get-excel', async (req, res) => {
  const name_file = req.body.name_file;
  res.download('./comprobantes-cierre/' + name_file);
});

module.exports = route;