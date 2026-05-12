import { Cidade } from '../models/Cidade.js';

class CidadeService {
  static async findAll() {
    const objs = await Cidade.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Cidade.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async findByEstado(req) {
    const { id } = req.params;
    const objs = await Cidade.findAll({
      where: { estadoId: id },
      include: { all: true, nested: true }
    });
    return objs;
  }

  // ==========================================
  // Verificacao das Regras de Negocio
  // ==========================================
  static async verificarRegrasDeNegocio(nome, estadoId, cidadeAtualId = null) {
    const { Op } = (await import('sequelize'));
    
    const baseWhere = cidadeAtualId ? { codigo: { [Op.ne]: cidadeAtualId } } : {};

    const conflito = await Cidade.findOne({
      where: {
        ...baseWhere,
        nome,
        estadoId
      }
    });

    if (conflito) {
      throw 'RN: Já existe uma cidade com este nome cadastrada neste estado!';
    }
  }

  static async create(req) {
    const { nome, estadoId } = req.body;
    await this.verificarRegrasDeNegocio(nome, estadoId);
    const obj = await Cidade.create({ nome, estadoId });
    return await Cidade.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, estadoId } = req.body;
    await this.verificarRegrasDeNegocio(nome, estadoId, id);
    const obj = await Cidade.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Cidade nao encontrada!';
    Object.assign(obj, { nome, estadoId });
    await obj.save();
    return await Cidade.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Cidade.findByPk(id);
    if (obj == null) throw 'Cidade nao encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw 'Nao e possivel remover uma cidade com vinculos existentes.';
    }
  }
}

export { CidadeService };
