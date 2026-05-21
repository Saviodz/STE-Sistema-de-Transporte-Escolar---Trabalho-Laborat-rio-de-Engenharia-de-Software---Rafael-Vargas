import { Onibus } from '../models/Onibus.js';
import sequelize from '../config/database-connection.js';
import { QueryTypes } from 'sequelize';

class OnibusService {
  static async findAll() {
    const objs = await Onibus.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Onibus.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { placa, modelo, capacidade, ano, situacao } = req.body;
    const obj = await Onibus.create({ placa, modelo, capacidade, ano, situacao });
    return await Onibus.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { placa, modelo, capacidade, ano, situacao } = req.body;
    const obj = await Onibus.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Onibus nao encontrado!';
    Object.assign(obj, { placa, modelo, capacidade, ano, situacao });
    await obj.save();
    return await Onibus.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Onibus.findByPk(id);
    if (obj == null) throw 'Onibus nao encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw 'Nao e possivel remover um onibus com vinculos existentes.';
    }
  }

  static async utilizacaoFrota(req) {
    const { dataInicial, dataFinal } = req.query;
    if (!dataInicial || !dataFinal) {
      throw "Parâmetros 'dataInicial' e 'dataFinal' são obrigatórios na query string!";
    }
    if (new Date(dataInicial) > new Date(dataFinal)) {
      throw "RN: A data inicial não pode ser posterior à data final.";
    }

    // Consulta agregada para contar a quantidade de viagens de cada ônibus
    const sql = `
      SELECT o.codigo AS onibusId, o.placa AS placa, o.modelo AS modelo, o.capacidade AS capacidade, o.situacao AS situacao, COUNT(v.codigo) AS quantidadeViagens
      FROM onibus o
      LEFT JOIN viagens v ON v.onibus_id = o.codigo AND v.data BETWEEN :dataInicial AND :dataFinal
      GROUP BY o.codigo, o.placa, o.modelo, o.capacidade, o.situacao
      ORDER BY quantidadeViagens DESC
    `;

    const objs = await sequelize.query(sql, {
      replacements: { dataInicial, dataFinal },
      type: QueryTypes.SELECT
    });
    return objs;
  }
}

export { OnibusService };
