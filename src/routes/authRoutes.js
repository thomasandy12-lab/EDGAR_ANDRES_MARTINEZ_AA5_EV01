const express = require('express');
const {
  registrarUsuario,
  iniciarSesion
} = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/registro: crea un usuario nuevo.
router.post('/registro', registrarUsuario);

// POST /api/auth/login: valida usuario y contraseña.
router.post('/login', iniciarSesion);

module.exports = router;
