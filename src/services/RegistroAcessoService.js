import { RegistroAcesso } from '../models/RegistroAcesso.js';

class RegistroAcessoService {
  static async findAll() {
    const objs = await RegistroAcesso.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params; 
    const obj = await RegistroAcesso.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { tipo, dataHora, alunoId, viagemId } = req.body;
    const obj = await RegistroAcesso.create({ tipo, dataHora, alunoId, viagemId });
    return await RegistroAcesso.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { tipo, dataHora, alunoId, viagemId } = req.body;
    const obj = await RegistroAcesso.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Registro de acesso nao encontrado!';
    Object.assign(obj, { tipo, dataHora, alunoId, viagemId });
    await obj.save();
    return await RegistroAcesso.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await RegistroAcesso.findByPk(id);
    if (obj == null) throw 'Registro de acesso nao encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw 'Nao e possivel remover um registro de acesso com vinculos existentes.';
    }
  }
}

export { RegistroAcessoService };
