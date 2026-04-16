import { ViagemService } from '../services/ViagemService.js';

class ViagemController {
  static async findAll(req, res, next) {
    ViagemService.findAll(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    ViagemService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    ViagemService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    ViagemService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    ViagemService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { ViagemController };
