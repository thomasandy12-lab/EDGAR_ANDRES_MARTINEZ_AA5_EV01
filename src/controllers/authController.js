const bcrypt = require('bcryptjs');
const {
  buscarUsuario,
  crearUsuario
} = require('../services/userStore');

const normalizarUsuario = (valor) => String(valor || '').trim().toLowerCase();

const validarEntrada = (usuario, contrasena) => {
  if (!usuario || !contrasena) {
    return 'El usuario y la contraseña son obligatorios.';
  }

  if (usuario.length < 4) {
    return 'El usuario debe tener mínimo 4 caracteres.';
  }

  if (contrasena.length < 6) {
    return 'La contraseña debe tener mínimo 6 caracteres.';
  }

  return null;
};

const registrarUsuario = async (request, response, next) => {
  try {
    const usuario = normalizarUsuario(request.body.usuario);
    const contrasena = String(request.body.contrasena || '');
    const errorValidacion = validarEntrada(usuario, contrasena);

    if (errorValidacion) {
      return response.status(400).json({
        ok: false,
        mensaje: errorValidacion
      });
    }

    const usuarioExistente = await buscarUsuario(usuario);

    if (usuarioExistente) {
      return response.status(409).json({
        ok: false,
        mensaje: 'El usuario ya se encuentra registrado.'
      });
    }

    // La contraseña no se almacena en texto plano.
    const passwordHash = await bcrypt.hash(contrasena, 10);
    const nuevoUsuario = await crearUsuario(usuario, passwordHash);

    return response.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado correctamente.',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.usuario
      }
    });
  } catch (error) {
    return next(error);
  }
};

const iniciarSesion = async (request, response, next) => {
  try {
    const usuario = normalizarUsuario(request.body.usuario);
    const contrasena = String(request.body.contrasena || '');

    if (!usuario || !contrasena) {
      return response.status(400).json({
        ok: false,
        mensaje: 'El usuario y la contraseña son obligatorios.'
      });
    }

    const usuarioRegistrado = await buscarUsuario(usuario);

    if (!usuarioRegistrado) {
      return response.status(401).json({
        ok: false,
        mensaje: 'Error en la autenticación.'
      });
    }

    const credencialesValidas = await bcrypt.compare(
      contrasena,
      usuarioRegistrado.passwordHash
    );

    if (!credencialesValidas) {
      return response.status(401).json({
        ok: false,
        mensaje: 'Error en la autenticación.'
      });
    }

    return response.status(200).json({
      ok: true,
      mensaje: 'Autenticación satisfactoria.',
      usuario: usuarioRegistrado.usuario
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion
};
