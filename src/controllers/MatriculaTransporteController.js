import { MatriculaTransporteService } from '../services/MatriculaTransporteService.js';

class MatriculaTransporteController {
  static async findAll(req, res, next) {
    MatriculaTransporteService.findAll(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    MatriculaTransporteService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    MatriculaTransporteService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    MatriculaTransporteService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    MatriculaTransporteService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { MatriculaTransporteController };
