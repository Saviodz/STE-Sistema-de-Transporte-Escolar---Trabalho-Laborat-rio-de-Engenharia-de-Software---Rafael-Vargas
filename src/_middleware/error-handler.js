function errorHandler(error, req, res, next) {
  if (typeof error === 'string') {
    return res.status(400).json({
      erro: error
    });
  }

  if (error?.status) {
    return res.status(error.status).json({
      erro: error.message
    });
  }

  if (error?.name === 'SequelizeValidationError') {
    return res.status(400).json({
      erro: 'Erro de validacao.',
      mensagens: error.errors.map((item) => item.message)
    });
  }

  if (error?.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      erro: 'Registro duplicado.',
      mensagens: error.errors.map((item) => item.message)
    });
  }

  if (error?.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({
      erro: 'Registro possui relacionamento que impede esta operacao.'
    });
  }

  return res.status(500).json({
    erro: 'Erro interno.',
    detalhe: error?.message || 'Erro inesperado.'
  });
}

export default errorHandler;
