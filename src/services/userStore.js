const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const dataFile = path.join(__dirname, '../../data/users.json');

const leerUsuarios = async () => {
  const contenido = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(contenido);
};

const guardarUsuarios = async (usuarios) => {
  const archivoTemporal = `${dataFile}.tmp`;
  const contenido = `${JSON.stringify(usuarios, null, 2)}\n`;

  // Se escribe primero en un archivo temporal para reducir el riesgo de corrupción.
  await fs.writeFile(archivoTemporal, contenido, 'utf8');
  await fs.rename(archivoTemporal, dataFile);
};

const buscarUsuario = async (nombreUsuario) => {
  const usuarios = await leerUsuarios();
  return usuarios.find((item) => item.usuario === nombreUsuario) || null;
};

const crearUsuario = async (usuario, passwordHash) => {
  const usuarios = await leerUsuarios();
  const nuevoUsuario = {
    id: randomUUID(),
    usuario,
    passwordHash,
    creadoEn: new Date().toISOString()
  };

  usuarios.push(nuevoUsuario);
  await guardarUsuarios(usuarios);

  return nuevoUsuario;
};

module.exports = {
  buscarUsuario,
  crearUsuario
};
