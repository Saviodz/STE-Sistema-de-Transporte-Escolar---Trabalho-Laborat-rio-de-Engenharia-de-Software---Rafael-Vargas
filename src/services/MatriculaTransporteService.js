import { MatriculaTransporte } from '../models/MatriculaTransporte.js';
import { Aluno } from '../models/Aluno.js';
import { Op } from 'sequelize';
import sequelize from '../config/database-connection.js';

class MatriculaTransporteService {
  static async findAll() {
    const objs = await MatriculaTransporte.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await MatriculaTransporte.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { alunoId, rotaId } = req.body;
    if (await this.verificarRegrasDeNegocio(req)) {
      const t = await sequelize.transaction();
      try {
        const obj = await MatriculaTransporte.create({
          alunoId,
          rotaId
        }, { transaction: t });
        await t.commit();
        return await MatriculaTransporte.findByPk(obj.codigo, { include: { all: true, nested: true } });
      } catch (error) {
        await t.rollback();
        throw "Erro ao registrar a matricula de transporte!";
      }
    }
  }

  // ==========================================
  // Verificacao das Regras de Negocio
  // ==========================================
  static async verificarRegrasDeNegocio(req, matriculaAtualId = null) {
    const { alunoId, rotaId } = req.body;

    // RN01: O aluno com situacao diferente de 'Ativo' nao pode ser matriculado em uma rota de transporte.
    const aluno = await Aluno.findByPk(alunoId);
    if (aluno == null) throw 'Aluno nao encontrado!';
    if (aluno.situacaoAcesso.toUpperCase() !== 'ATIVO') {
      throw "RN01: O aluno com situacao diferente de 'Ativo' nao pode ser matriculado em uma rota de transporte!";
    }

    // Condicao base da busca, excluindo a propria matricula no caso de update.
    const where = { alunoId, rotaId };
    if (matriculaAtualId != null) {
      where.codigo = { [Op.ne]: matriculaAtualId };
    }

    // RN02: O aluno nao pode ser matriculado mais de uma vez na mesma rota.
    const matriculaExistente = await MatriculaTransporte.findAll({ where });
    if (matriculaExistente.length > 0) {
      throw 'RN02: O aluno ja esta matriculado nesta rota de transporte!';
    }

    return true;
  }

  static async update(req) {
    const { id } = req.params;
    const { alunoId, rotaId } = req.body;
    const obj = await MatriculaTransporte.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Matricula de transporte nao encontrada!';

    // Reaplica as regras de negocio, ignorando a propria matricula na contagem.
    await this.verificarRegrasDeNegocio(req, id);

    Object.assign(obj, { alunoId, rotaId });
    await obj.save();
    return await MatriculaTransporte.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await MatriculaTransporte.findByPk(id);
    if (obj == null) throw 'Matricula de transporte nao encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw 'Nao e possivel remover uma matricula de transporte com vinculos existentes.';
    }
  }
}

export { MatriculaTransporteService };
