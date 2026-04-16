import { InstituicaoEnsino } from '../models/InstituicaoEnsino.js';

class InstituicaoEnsinoService {
  static async findAll() {
    const objs = await InstituicaoEnsino.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await InstituicaoEnsino.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { nome, endereco, telefones, tipoInstituicao, cidadeId } = req.body;
    const obj = await InstituicaoEnsino.create({
      nome,
      endereco,
      telefones,
      tipoInstituicao,
      cidadeId
    });
    return await InstituicaoEnsino.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, endereco, telefones, tipoInstituicao, cidadeId } = req.body;
    const obj = await InstituicaoEnsino.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Instituicao de ensino nao encontrada!';
    Object.assign(obj, { nome, endereco, telefones, tipoInstituicao, cidadeId });
    await obj.save();
    return await InstituicaoEnsino.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await InstituicaoEnsino.findByPk(id);
    if (obj == null) throw 'Instituicao de ensino nao encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw 'Nao e possivel remover uma instituicao de ensino com vinculos existentes.';
    }
  }
}

export { InstituicaoEnsinoService };
