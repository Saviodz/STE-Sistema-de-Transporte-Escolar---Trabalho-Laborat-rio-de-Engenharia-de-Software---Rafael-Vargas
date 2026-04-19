import express from 'express';
import routes from './routes.js';
import errorHandler from './_middleware/error-handler.js';

import './config/database-connection.js';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(routes);
app.use(errorHandler);

app.listen(3333, () => {
  console.log('Servidor executando em http://localhost:3333');
});
