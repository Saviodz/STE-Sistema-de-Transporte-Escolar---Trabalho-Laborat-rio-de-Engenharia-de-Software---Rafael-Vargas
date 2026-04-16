import { RotaService } from '../services/RotaService.js';

class RotaController {
  static async findAll(req, res, next) {
    RotaService.findAll(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    RotaService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    RotaService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    RotaService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    RotaService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { RotaController };
