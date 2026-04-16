import { Aluno } from '../models/Aluno.js';

class AlunoService {
  static async findAll() {
    const objs = await Aluno.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Aluno.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const {
      nome,
      foto,
      cpf,
      dataNascimento,
      endereco,
      telefones,
      responsavelLegal,
      situacaoAcesso,
      prefeituraId,
      instituicaoEnsinoId
    } = req.body;
    const obj = await Aluno.create({
      nome,
      foto,
      cpf,
      dataNascimento,
      endereco,
      telefones,
      responsavelLegal,
      situacaoAcesso,
      prefeituraId,
      instituicaoEnsinoId
    });
    return await Aluno.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async update(req) {
    const { id } = req.params;
    const {
      nome,
      foto,
      cpf,
      dataNascimento,
      endereco,
      telefones,
      responsavelLegal,
      situacaoAcesso,
      prefeituraId,
      instituicaoEnsinoId
    } = req.body;
    const obj = await Aluno.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Aluno nao encontrado!';
    Object.assign(obj, {
      nome,
      foto,
      cpf,
      dataNascimento,
      endereco,
      telefones,
      responsavelLegal,
      situacaoAcesso,
      prefeituraId,
      instituicaoEnsinoId
    });
    await obj.save();
    return await Aluno.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Aluno.findByPk(id);
    if (obj == null) throw 'Aluno nao encontrado!';
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw 'Nao e possivel remover um aluno com vinculos existentes.';
    }
  }
}

export { AlunoService };
