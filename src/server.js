import express from 'express';
import './config/database-connection.js';

const app = express();

app.listen(3333, () => {
  console.log('Servidor executando em http://localhost:3333');
});
