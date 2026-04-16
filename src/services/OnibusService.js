import { Onibus } from '../models/Onibus.js';

class OnibusService {
  static async findAll() {
    const objs = await Onibus.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Onibus.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { placa, modelo, capacidade, ano, situacao } = req.body;
    const obj = await Onibus.create({ placa, modelo, capacidade, ano, situacao });
    return await Onibus.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { placa, modelo, capacidade, ano, situacao } = req.body;
    const obj = await Onibus.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Onibus nao encontrado!';
    Object.assign(obj, { placa, modelo, capacidade, ano, situacao });
    await obj.save();
    return await Onibus.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Onibus.findByPk(id);
    if (obj == null) throw 'Onibus nao encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw 'Nao e possivel remover um onibus com vinculos existentes.';
    }
  }
}

export { OnibusService };
