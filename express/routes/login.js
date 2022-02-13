const bcrypt = require('bcryptjs');
const express = require('express');
const route = express.Router();
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

route.get('/create-admin', async (req, res) => {
  await Usuario.create({
    username: 'admin',
    fecha_alta: new Date(),
    activo: true,
    nombre: 'Super Admin',
    password: await bcrypt.hash('admin', 12),
    permiso_abrir_dias: true,
    permiso_cerrar_dias: true,
    permiso_cerrar_modificaciones: true,
    permiso_ingresar: true,
    permiso_modificar: true,
    permiso_modificar_usuarios: true
  }).then(usuario => {
    res.json(usuario);
  }).catch(error => {
    res.json(error);
  })
});

route.post('/login', async (req, res) => {
  const { username, password } = req.body;
  await Usuario.findOne({
    where: {
      username: username
    }
  })
  .then(async usuario => {
    const match = usuario ? await bcrypt.compare(password,usuario.password) : false;
    if(match) {
      // let json = JSON.stringify(usuario);
      token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 30),
        data: usuario
      }, 'SeCrEtO-918273');
      console.log({token})
      res.json({token});
      return;
    }
  })
  .catch();
   
  res.json();
});

route.post('/test', verifyToken, (req, res) => {
  res.json(req.data);
});

function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).json('No se encuentra token');
  }
  const token = req.headers.authorization.substr(7);
  if (token !== '') {
    try {
      const content = jwt.verify(token, 'SeCrEtO-918273');
      req.data = content;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json('Token inválido');
    }
  } else {
    res.status(401).json('Token vacío');
  }
}

module.exports = route;