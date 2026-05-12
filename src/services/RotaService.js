import { Rota } from '../models/Rota.js';

class RotaService {
  static async findAll() {
    const objs = await Rota.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Rota.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  // ==========================================
  // Verificacao das Regras de Negocio
  // ==========================================
  static verificarRegrasDeNegocio(origemId, destinoId) {
    if (origemId === destinoId) {
      throw 'RN: A Cidade de Origem não pode ser igual à Cidade de Destino.';
    }
  }

  static async create(req) {
    const { turno, descricao, observacao, origemId, destinoId } = req.body;
    this.verificarRegrasDeNegocio(origemId, destinoId);
    const obj = await Rota.create({ turno, descricao, observacao, origemId, destinoId });
    return await Rota.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { turno, descricao, observacao, origemId, destinoId } = req.body;
    this.verificarRegrasDeNegocio(origemId, destinoId);
    const obj = await Rota.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Rota nao encontrada!';
    Object.assign(obj, { turno, descricao, observacao, origemId, destinoId });
    await obj.save();
    return await Rota.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Rota.findByPk(id);
    if (obj == null) throw 'Rota nao encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw 'Nao e possivel remover uma rota com vinculos existentes.';
    }
  }
}

export { RotaService };
