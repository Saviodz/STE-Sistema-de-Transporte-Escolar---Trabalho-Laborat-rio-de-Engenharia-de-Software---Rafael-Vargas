import { RelatorioService } from '../services/RelatorioService.js';

class RelatorioController {
  static async alunosPorRota(req, res) {
    try {
      const objs = await RelatorioService.alunosPorRota(req);
      res.json(objs);
    } catch (e) {
      res.status(400).json({ erro: e.message || e });
    }
  }

  static async acessosPorPeriodo(req, res) {
    try {
      const objs = await RelatorioService.acessosPorPeriodo(req);
      res.json(objs);
    } catch (e) {
      res.status(400).json({ erro: e.message || e });
    }
  }
}

export { RelatorioController };
