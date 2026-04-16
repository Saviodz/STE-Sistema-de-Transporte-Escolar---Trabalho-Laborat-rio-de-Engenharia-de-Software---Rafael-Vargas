import { PrefeituraService } from '../services/PrefeituraService.js';

class PrefeituraController {
  static async findAll(req, res, next) {
    PrefeituraService.findAll(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    PrefeituraService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    PrefeituraService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    PrefeituraService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    PrefeituraService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { PrefeituraController };
