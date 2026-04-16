import express from 'express';
import routes from './routes.js';

import './config/database-connection.js';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(routes);

app.use((error, req, res, next) => {
  if (typeof error === 'string') {
    return res.status(400).json({
      erro: error
    });
  }

  if (error.status) {
    return res.status(error.status).json({
      erro: error.message
    });
  }

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      erro: 'Erro de validacao.',
      mensagens: error.errors.map((item) => item.message)
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      erro: 'Registro duplicado.',
      mensagens: error.errors.map((item) => item.message)
    });
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({
      erro: 'Registro possui relacionamento que impede esta operacao.'
    });
  }

  return res.status(500).json({
    erro: 'Erro interno.',
    detalhe: error.message
  });
});

app.listen(3333, () => {
  console.log('Servidor executando em http://localhost:3333');
});
