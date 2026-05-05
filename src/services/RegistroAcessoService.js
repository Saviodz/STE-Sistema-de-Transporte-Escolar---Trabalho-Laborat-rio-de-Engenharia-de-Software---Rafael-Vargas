import { RegistroAcesso } from '../models/RegistroAcesso.js';
import { Op } from 'sequelize';
import sequelize from '../config/database-connection.js';

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
    if (await this.verificarRegrasDeNegocio(req)) {
      const t = await sequelize.transaction();
      try {
        const obj = await RegistroAcesso.create({
          tipo,
          dataHora,
          alunoId,
          viagemId
        }, { transaction: t });
        await t.commit();
        return await RegistroAcesso.findByPk(obj.codigo, { include: { all: true, nested: true } });
      } catch (error) {
        await t.rollback();
        throw "Erro ao registrar o acesso!";
      }
    }
  }

  // ==========================================
  // Verificacao das Regras de Negocio
  // ==========================================
  static async verificarRegrasDeNegocio(req) {
    const { tipo, dataHora, alunoId, viagemId } = req.body;

    // Extrair apenas a data (YYYY-MM-DD) do campo dataHora
    const dataRegistro = dataHora.substring(0, 10);

    // Buscar todos os registros do aluno no mesmo dia
    const registrosDoDia = await RegistroAcesso.findAll({
      where: {
        alunoId: alunoId,
        dataHora: {
          [Op.between]: [`${dataRegistro}T00:00:00`, `${dataRegistro}T23:59:59`]
        }
      }
    });

    const embarquesDoDia = registrosDoDia.filter(r => r.tipo === 'EMBARQUE').length;
    const desembarquesDoDia = registrosDoDia.filter(r => r.tipo === 'DESEMBARQUE').length;

    // Regra de Negocio 1: O aluno nao pode registrar mais de 2 embarques no mesmo dia
    if (tipo === 'EMBARQUE' && embarquesDoDia >= 2) {
      throw "O aluno nao pode registrar mais de 2 embarques no mesmo dia!";
    }

    // Regra de Negocio 2: O aluno so pode registrar um desembarque se tiver mais embarques do que desembarques no dia
    if (tipo === 'DESEMBARQUE' && embarquesDoDia <= desembarquesDoDia) {
      throw "O aluno so pode registrar um desembarque se tiver mais embarques do que desembarques no dia!";
    }

    return true;
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
