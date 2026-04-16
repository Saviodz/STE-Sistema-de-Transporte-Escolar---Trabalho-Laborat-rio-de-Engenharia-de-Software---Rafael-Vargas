import express from 'express';

import { EstadoController } from './controllers/EstadoController.js';
import { CidadeController } from './controllers/CidadeController.js';
import { PrefeituraController } from './controllers/PrefeituraController.js';
import { InstituicaoEnsinoController } from './controllers/InstituicaoEnsinoController.js';
import { AlunoController } from './controllers/AlunoController.js';
import { MotoristaController } from './controllers/MotoristaController.js';
import { OnibusController } from './controllers/OnibusController.js';
import { RotaController } from './controllers/RotaController.js';
import { ViagemController } from './controllers/ViagemController.js';
import { MatriculaTransporteController } from './controllers/MatriculaTransporteController.js';
import { RegistroAcessoController } from './controllers/RegistroAcessoController.js';

const routes = express.Router();

function resource(path, controller) {
  routes.get(path, controller.findAll);
  routes.get(`${path}/:id`, controller.findByPk);
  routes.post(path, controller.create);
  routes.put(`${path}/:id`, controller.update);
  routes.delete(`${path}/:id`, controller.delete);
}

routes.get('/', (req, res) => {
  return res.json({
    mensagem: 'API do Sistema de Transporte Escolar',
    dica: 'Use ?include=true para carregar os relacionamentos.'
  });
});

resource('/estados', EstadoController);
resource('/cidades', CidadeController);
routes.get('/cidades/findByEstado/:id', CidadeController.findByEstado);
resource('/prefeituras', PrefeituraController);
resource('/instituicoes-ensino', InstituicaoEnsinoController);
resource('/alunos', AlunoController);
resource('/motoristas', MotoristaController);
resource('/onibus', OnibusController);
resource('/rotas', RotaController);
resource('/viagens', ViagemController);
resource('/matriculas-transporte', MatriculaTransporteController);
resource('/registros-acesso', RegistroAcessoController);

export default routes;
