import { MatriculaTransporte } from '../models/MatriculaTransporte.js';

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
    const obj = await MatriculaTransporte.create({ alunoId, rotaId });
    return await MatriculaTransporte.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const { alunoId, rotaId } = req.body;
    const obj = await MatriculaTransporte.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Matricula de transporte nao encontrada!';
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
