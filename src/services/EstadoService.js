import { Estado } from '../models/Estado.js';

class EstadoService {
  static async findAll() {
    const objs = await Estado.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Estado.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { nome, siglaUF } = req.body;
    const obj = await Estado.create({ nome, siglaUF });
    return await Estado.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, siglaUF } = req.body;
    const obj = await Estado.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Estado nao encontrado!';
    Object.assign(obj, { nome, siglaUF });
    await obj.save();
    return await Estado.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Estado.findByPk(id);
    if (obj == null) throw 'Estado nao encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw 'Nao e possivel remover um estado com vinculos existentes.';
    }
  }
}

export { EstadoService };
