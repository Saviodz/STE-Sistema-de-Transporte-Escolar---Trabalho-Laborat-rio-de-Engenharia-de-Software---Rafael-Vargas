import { RegistroAcessoService } from '../services/RegistroAcessoService.js';

class RegistroAcessoController {
  static async findAll(req, res, next) {
    RegistroAcessoService.findAll(req)
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    RegistroAcessoService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    RegistroAcessoService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    RegistroAcessoService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    RegistroAcessoService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { RegistroAcessoController };
