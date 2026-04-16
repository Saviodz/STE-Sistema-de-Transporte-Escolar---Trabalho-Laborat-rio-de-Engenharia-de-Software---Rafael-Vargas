import { OnibusService } from '../services/OnibusService.js';

class OnibusController {
  static async findAll(req, res, next) {
    OnibusService.findAll(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    OnibusService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    OnibusService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    OnibusService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    OnibusService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { OnibusController };
