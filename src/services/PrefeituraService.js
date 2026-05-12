import { Prefeitura } from '../models/Prefeitura.js';

class PrefeituraService {
  static async findAll() {
    const objs = await Prefeitura.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Prefeitura.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  // ==========================================
  // Verificacao das Regras de Negocio
  // ==========================================
  static async verificarRegrasDeNegocio(cidadeId, prefeituraAtualId = null) {
    const { Op } = (await import('sequelize'));
    const whereClause = { cidadeId };
    if (prefeituraAtualId) {
      whereClause.codigo = { [Op.ne]: prefeituraAtualId };
    }
    const count = await Prefeitura.count({ where: whereClause });
    if (count > 0) {
      throw 'RN: Já existe uma prefeitura vinculada a esta cidade.';
    }
  }

  static async create(req) {
    const { razaoSocial, cnpj, endereco, telefones, email, cidadeId } = req.body;
    await this.verificarRegrasDeNegocio(cidadeId);
    const obj = await Prefeitura.create({
      razaoSocial,
      cnpj,
      endereco,
      telefones,
      email,
      cidadeId
    });
    return await Prefeitura.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { razaoSocial, cnpj, endereco, telefones, email, cidadeId } = req.body;
    await this.verificarRegrasDeNegocio(cidadeId, id);
    const obj = await Prefeitura.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Prefeitura nao encontrada!';
    Object.assign(obj, { razaoSocial, cnpj, endereco, telefones, email, cidadeId });
    await obj.save();
    return await Prefeitura.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Prefeitura.findByPk(id);
    if (obj == null) throw 'Prefeitura nao encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw 'Nao e possivel remover uma prefeitura com vinculos existentes.';
    }
  }
}

export { PrefeituraService };
