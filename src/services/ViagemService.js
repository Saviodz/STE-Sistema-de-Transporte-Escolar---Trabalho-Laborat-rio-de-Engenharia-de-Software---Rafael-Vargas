import { Viagem } from '../models/Viagem.js';
import { Op } from 'sequelize';
import sequelize from '../config/database-connection.js';

class ViagemService {
  static async findAll() {
    const objs = await Viagem.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Viagem.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { data, horarioSaida, horarioChegada, rotaId, motoristaId, onibusId } = req.body;
    if (await this.verificarRegrasDeNegocio(req)) {
      const t = await sequelize.transaction();
      try {
        const obj = await Viagem.create({
          data,
          horarioSaida,
          horarioChegada,
          rotaId,
          motoristaId,
          onibusId
        }, { transaction: t });
        await t.commit();
        return await Viagem.findByPk(obj.codigo, { include: { all: true, nested: true } });
      } catch (error) {
        await t.rollback();
        throw "Erro ao registrar a viagem!";
      }
    }
  }

  // ==========================================
  // Verificacao das Regras de Negocio
  // ==========================================
  static async verificarRegrasDeNegocio(req, viagemAtualId = null) {
    const { data, motoristaId, onibusId } = req.body;

    // Condicao base da busca, excluindo a propria viagem no caso de update.
    const whereBase = viagemAtualId != null ? { codigo: { [Op.ne]: viagemAtualId } } : {};

    // RF37 Regra 4: Motorista Ativo e CNH valida na data da viagem.
    const { Motorista } = (await import('../models/Motorista.js'));
    const motorista = await Motorista.findByPk(motoristaId);
    if (!motorista) throw 'Motorista não encontrado!';
    if (motorista.situacao.toUpperCase() !== 'ATIVO') {
      throw 'RN: O motorista selecionado não está ativo.';
    }
    if (new Date(motorista.validadeCNH) < new Date(data)) {
      throw 'RN: A CNH do motorista está vencida para a data desta viagem.';
    }

    // RF37 Regra 5: Ônibus Ativo.
    const { Onibus } = (await import('../models/Onibus.js'));
    const onibus = await Onibus.findByPk(onibusId);
    if (!onibus) throw 'Ônibus não encontrado!';
    if (onibus.situacao.toUpperCase() !== 'ATIVO') {
      throw 'RN: O ônibus selecionado não está ativo.';
    }

    // RN01: O motorista nao pode ser designado para mais de uma viagem na mesma data.
    const viagensMotorista = await Viagem.findAll({
      where: { ...whereBase, motoristaId, data }
    });
    if (viagensMotorista.length > 0) {
      throw 'RN01: Este motorista ja esta designado para outra viagem nesta data!';
    }

    // RN02: O onibus nao pode ser utilizado em mais de uma viagem na mesma data.
    const viagensOnibus = await Viagem.findAll({
      where: { ...whereBase, onibusId, data }
    });
    if (viagensOnibus.length > 0) {
      throw 'RN02: Este onibus ja esta alocado em outra viagem nesta data!';
    }

    return true;
  }

  static async update(req) {
    const { id } = req.params;
    const { data, horarioSaida, horarioChegada, rotaId, motoristaId, onibusId } = req.body;
    const obj = await Viagem.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Viagem nao encontrada!';

    // Reaplica as regras de negocio, ignorando a propria viagem na contagem.
    await this.verificarRegrasDeNegocio(req, id);

    Object.assign(obj, { data, horarioSaida, horarioChegada, rotaId, motoristaId, onibusId });
    await obj.save();
    return await Viagem.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Viagem.findByPk(id);
    if (obj == null) throw 'Viagem nao encontrada!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw 'Nao e possivel remover uma viagem com vinculos existentes.';
    }
  }
}

export { ViagemService };
