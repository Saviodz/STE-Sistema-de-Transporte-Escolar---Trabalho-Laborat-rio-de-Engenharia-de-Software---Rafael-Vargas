import { Viagem } from '../models/Viagem.js';

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
    const obj = await Viagem.create({
      data,
      horarioSaida,
      horarioChegada,
      rotaId,
      motoristaId,
      onibusId
    });
    return await Viagem.findByPk(obj.codigo, { include: { all: true, nested: true } });
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
