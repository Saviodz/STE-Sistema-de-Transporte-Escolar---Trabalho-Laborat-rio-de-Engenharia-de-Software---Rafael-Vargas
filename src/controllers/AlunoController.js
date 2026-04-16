import { AlunoService } from '../services/AlunoService.js';

class AlunoController {
  static async findAll(req, res, next) {
    AlunoService.findAll(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    AlunoService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    AlunoService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    AlunoService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    AlunoService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { AlunoController };
