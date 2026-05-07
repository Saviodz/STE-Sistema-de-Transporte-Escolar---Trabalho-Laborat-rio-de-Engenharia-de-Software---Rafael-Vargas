import { RelatorioService } from '../services/RelatorioService.js';

class RelatorioController {
  static async alunosPorRota(req, res, next) {
    RelatorioService.alunosPorRota(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async acessosPorPeriodo(req, res, next) {
    RelatorioService.acessosPorPeriodo(req)
      .then(objs => res.json(objs))
      .catch(next);
  }
}

export { RelatorioController };
