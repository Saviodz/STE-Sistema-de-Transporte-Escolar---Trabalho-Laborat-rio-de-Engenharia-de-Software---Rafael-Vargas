import express from 'express';
import path from 'path';
import routes from './routes.js';
import errorHandler from './_middleware/error-handler.js';
import { fileURLToPath } from 'url';

import './config/database-connection.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.resolve(__dirname, '../public');

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/app', express.static(frontendPath));

app.get('/app', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use(routes);
app.use(errorHandler);

app.listen(3333, () => {
  console.log('Servidor executando em http://localhost:3333 | Frontend inicial em http://localhost:3333/app');
});
