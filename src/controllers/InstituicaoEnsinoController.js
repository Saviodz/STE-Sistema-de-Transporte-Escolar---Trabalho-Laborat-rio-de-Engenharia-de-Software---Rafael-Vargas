import { InstituicaoEnsinoService } from '../services/InstituicaoEnsinoService.js';

class InstituicaoEnsinoController {
  static async findAll(req, res, next) {
    InstituicaoEnsinoService.findAll(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    InstituicaoEnsinoService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    InstituicaoEnsinoService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    InstituicaoEnsinoService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    InstituicaoEnsinoService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { InstituicaoEnsinoController };
