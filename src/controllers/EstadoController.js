import { EstadoService } from '../services/EstadoService.js';

class EstadoController {
  static async findAll(req, res, next) {
    EstadoService.findAll(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    EstadoService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    EstadoService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    EstadoService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    EstadoService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { EstadoController };
