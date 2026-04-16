import { MotoristaService } from '../services/MotoristaService.js';

class MotoristaController {
  static async findAll(req, res, next) {
    MotoristaService.findAll(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    MotoristaService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    MotoristaService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    MotoristaService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    MotoristaService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { MotoristaController };
