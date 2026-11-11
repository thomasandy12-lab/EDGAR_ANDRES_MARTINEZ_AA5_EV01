const errorHandler = (error, request, response, next) => {
  console.error(error);

  if (response.headersSent) {
    return next(error);
  }

  return response.status(500).json({
    ok: false,
    mensaje: 'Se presentó un error interno en el servicio.'
  });
};

module.exports = errorHandler;
