import { Motorista } from '../models/Motorista.js';

class MotoristaService {
  static async findAll() {
    const objs = await Motorista.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Motorista.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { nome, cpf, cnh, validadeCNH, categoriaCNH, telefones, situacao } = req.body;
    const obj = await Motorista.create({
      nome,
      cpf,
      cnh,
      validadeCNH,
      categoriaCNH,
      telefones,
      situacao
    });
    return await Motorista.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, cpf, cnh, validadeCNH, categoriaCNH, telefones, situacao } = req.body;
    const obj = await Motorista.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Motorista nao encontrado!';
    Object.assign(obj, {
      nome,
      cpf,
      cnh,
      validadeCNH,
      categoriaCNH,
      telefones,
      situacao
    });
    await obj.save();
    return await Motorista.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Motorista.findByPk(id);
    if (obj == null) throw 'Motorista nao encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw 'Nao e possivel remover um motorista com vinculos existentes.';
    }
  }
}

export { MotoristaService };
