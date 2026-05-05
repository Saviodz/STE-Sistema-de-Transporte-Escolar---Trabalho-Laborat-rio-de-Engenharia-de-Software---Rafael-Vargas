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
import { RelatorioController } from './controllers/RelatorioController.js';

const routes = express.Router();

routes.get('/', (req, res) => {
  return res.json({
    mensagem: 'API do Sistema de Transporte Escolar',
    dica: 'Use ?include=true para carregar os relacionamentos.'
  });
});

routes.get('/estados', EstadoController.findAll);
routes.get('/estados/:id', EstadoController.findByPk);
routes.post('/estados', EstadoController.create);
routes.delete('/estados/:id', EstadoController.delete);
routes.put('/estados/:id', EstadoController.update);

routes.get('/cidades', CidadeController.findAll);
routes.get('/cidades/findByEstado/:id', CidadeController.findByEstado);
routes.get('/cidades/:id', CidadeController.findByPk);
routes.post('/cidades', CidadeController.create);
routes.delete('/cidades/:id', CidadeController.delete);
routes.put('/cidades/:id', CidadeController.update);

routes.get('/prefeituras', PrefeituraController.findAll);
routes.get('/prefeituras/:id', PrefeituraController.findByPk);
routes.post('/prefeituras', PrefeituraController.create);
routes.delete('/prefeituras/:id', PrefeituraController.delete);
routes.put('/prefeituras/:id', PrefeituraController.update);

routes.get('/instituicoes-ensino', InstituicaoEnsinoController.findAll);
routes.get('/instituicoes-ensino/:id', InstituicaoEnsinoController.findByPk);
routes.post('/instituicoes-ensino', InstituicaoEnsinoController.create);
routes.delete('/instituicoes-ensino/:id', InstituicaoEnsinoController.delete);
routes.put('/instituicoes-ensino/:id', InstituicaoEnsinoController.update);

routes.get('/alunos', AlunoController.findAll);
routes.get('/alunos/:id', AlunoController.findByPk);
routes.post('/alunos', AlunoController.create);
routes.delete('/alunos/:id', AlunoController.delete);
routes.put('/alunos/:id', AlunoController.update);

routes.get('/motoristas', MotoristaController.findAll);
routes.get('/motoristas/:id', MotoristaController.findByPk);
routes.post('/motoristas', MotoristaController.create);
routes.delete('/motoristas/:id', MotoristaController.delete);
routes.put('/motoristas/:id', MotoristaController.update);

routes.get('/onibus', OnibusController.findAll);
routes.get('/onibus/:id', OnibusController.findByPk);
routes.post('/onibus', OnibusController.create);
routes.delete('/onibus/:id', OnibusController.delete);
routes.put('/onibus/:id', OnibusController.update);

routes.get('/rotas', RotaController.findAll);
routes.get('/rotas/:id', RotaController.findByPk);
routes.post('/rotas', RotaController.create);
routes.delete('/rotas/:id', RotaController.delete);
routes.put('/rotas/:id', RotaController.update);

routes.get('/viagens', ViagemController.findAll);
routes.get('/viagens/:id', ViagemController.findByPk);
routes.post('/viagens', ViagemController.create);
routes.delete('/viagens/:id', ViagemController.delete);
routes.put('/viagens/:id', ViagemController.update);

routes.get('/matriculas-transporte', MatriculaTransporteController.findAll);
routes.get('/matriculas-transporte/:id', MatriculaTransporteController.findByPk);
routes.post('/matriculas-transporte', MatriculaTransporteController.create);
routes.delete('/matriculas-transporte/:id', MatriculaTransporteController.delete);
routes.put('/matriculas-transporte/:id', MatriculaTransporteController.update);

routes.get('/registros-acesso', RegistroAcessoController.findAll);
routes.get('/registros-acesso/:id', RegistroAcessoController.findByPk);
routes.post('/registros-acesso', RegistroAcessoController.create);
routes.delete('/registros-acesso/:id', RegistroAcessoController.delete);
routes.put('/registros-acesso/:id', RegistroAcessoController.update);

routes.get('/relatorios/alunos-por-rota/:rotaId', RelatorioController.alunosPorRota);
routes.get('/relatorios/acessos-por-periodo', RelatorioController.acessosPorPeriodo);

export default routes;
