const express = require('express');
const route = express.Router();
const Fecha = require('../models/fecha');
const multer = require('multer');
const Caja = require('../models/Caja');
const Cheque = require('../models/Cheque');

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

route.get('/activo', (req, res) => {
  Fecha.findAll({
    where: {
      activo: 1
    },
    attributes: ['fecha']
  })
    .then(fechas => {
      res.json(fechas);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

route.get('/suma-dia/:fecha', async (req, res) => {
  const fecha = req.params.fecha;
  await Caja.findAll({
    where: {
      fecha_fecha: fecha
    },
    include: [Cheque]
  }).then(cajas => {
    let suma = cajas.reduce((acc, item) => {
      let sumaCheques = item.Cheques.reduce((acc, item) => {
        return acc + item.importe;
      }, 0);
      return acc + item.efectivo + item.transferencia + sumaCheques;
    }, 0);
    res.json(suma);
  }).catch(err => {
    res.send('Error al buscar la fecha' + err);
  });
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
  await Fecha.create({
    fecha: fecha,
    activo: true,
    sobrante: null
  })
    .then(fecha => {
      res.json(fecha);
    })
    .catch(err => {
      res.send('Error al cargar fecha: ' + err);
    });
});

route.patch('/', upload, async (req, res) => {

  const { fecha, sobrante } = req.body;

  const fechaAEditar = await Fecha.findByPk(fecha);
  fechaAEditar.update({
    activo: false,
    sobrante: sobrante,
    name_file: req.file.filename
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