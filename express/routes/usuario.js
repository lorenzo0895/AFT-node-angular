const express = require('express');
const route = express.Router();
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

route.get('/', (req, res) => {
  Usuario.findAll()
    .then(usuarios => {
      res.json(usuarios);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

route.get('/:id', (req, res) => {
  const id = req.params.id;
  Usuario.findByPk(id)
    .then(usuario => {
      res.json(usuario);
    })
    .catch(err => {
      res.send('Error: ' + err);
    });
});

route.post('/', async (req, res) => {
  const {
    username,
    nombre,
    password,
    permiso_abrir_dias,
    permiso_cerrar_dias,
    permiso_cerrar_modificaciones,
    permiso_ingresar,
    permiso_modificar,
    permiso_modificar_usuarios
  } = req.body;
  newUsuario = await Usuario.create({
    activo: false,
    username: username,
    fecha_alta: new Date(),
    nombre: nombre,
    password: await bcrypt.hash(password, 12),
    permiso_abrir_dias: permiso_abrir_dias,
    permiso_cerrar_dias: permiso_cerrar_dias,
    permiso_cerrar_modificaciones: permiso_cerrar_modificaciones,
    permiso_ingresar: permiso_ingresar,
    permiso_modificar: permiso_modificar,
    permiso_modificar_usuarios: permiso_modificar_usuarios
  })
    .then(usuario => {
      res.json(usuario);
    })
    .catch(err => {
      res.send('Error al crear el usuario: ' + err);
    });
});

route.patch('/:id', async (req, res) => {
  const id = req.params.id;
  const {
    activo,
    username,
    nombre,
    permiso_abrir_dias,
    permiso_cerrar_dias,
    permiso_cerrar_modificaciones,
    permiso_ingresar,
    permiso_modificar,
    permiso_modificar_usuarios
  } = req.body;
  const usuarioAEditar = await Usuario.findByPk(id);
  usuarioAEditar.update({
    activo: activo,
    username: username,
    nombre: nombre,
    permiso_abrir_dias: permiso_abrir_dias,
    permiso_cerrar_dias: permiso_cerrar_dias,
    permiso_cerrar_modificaciones: permiso_cerrar_modificaciones,
    permiso_ingresar: permiso_ingresar,
    permiso_modificar: permiso_modificar,
    permiso_modificar_usuarios: permiso_modificar_usuarios
  });
  usuarioAEditar.save()
    .then(usuario => {
      res.json(usuario);
    })
    .catch(err => {
      res.send('Error al editar el usuario: ' + err);
    });
});

route.patch('/password/:id', async (req, res) => {
  const id = req.params.id;
  const {
    passwordAnterior,
    password1,
    password2
  } = req.body;

  const usuarioAEditar = await Usuario.findByPk(id);

  if (!await bcrypt.compare(passwordAnterior, usuarioAEditar.password)) {
    res.send('Contraseña actual incorrecta');
    return;
  }
  if (password1 != password2) {
    res.send('Las contraseñas no coinciden');
    return;
  }

  usuarioAEditar.update({
    password: await bcrypt.hash(password1, 12)
  });
  usuarioAEditar.save()
    .then(usuario => {
      res.json(usuario);
    })
    .catch(err => {
      res.send('Error al cambiar la contraseña: ' + err);
    });
});

module.exports = route;