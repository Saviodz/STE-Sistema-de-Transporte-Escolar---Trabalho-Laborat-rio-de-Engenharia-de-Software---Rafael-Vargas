import { Viagem } from '../models/Viagem.js';
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
  static async verificarRegrasDeNegocio(req) {
    const { data, horarioSaida, horarioChegada, rotaId, motoristaId, onibusId } = req.body;

    // Regra de Negocio 1: O motorista nao pode ser designado para mais de uma viagem na mesma data
    const viagensMotorista = await Viagem.findAll({
      where: { motoristaId: motoristaId, data: data }
    });
    if (viagensMotorista.length > 0) {
      throw "Este motorista ja esta designado para outra viagem nesta data!";
    }

    // Regra de Negocio 2: O onibus nao pode ser utilizado em mais de uma viagem na mesma data
    const viagensOnibus = await Viagem.findAll({
      where: { onibusId: onibusId, data: data }
    });
    if (viagensOnibus.length > 0) {
      throw "Este onibus ja esta alocado em outra viagem nesta data!";
    }

    return true;
  }

  static async update(req) {
    const { id } = req.params;
    const { data, horarioSaida, horarioChegada, rotaId, motoristaId, onibusId } = req.body;
    const obj = await Viagem.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Viagem nao encontrada!';
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
