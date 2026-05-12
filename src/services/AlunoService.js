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

  // ==========================================
  // Verificacao das Regras de Negocio
  // ==========================================
  static verificarRegrasDeNegocio(req) {
    const { dataNascimento, responsavelLegal } = req.body;
    if (dataNascimento) {
      const hoje = new Date();
      const nascimento = new Date(dataNascimento);
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const m = hoje.getMonth() - nascimento.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
      
      // RF01 Regra 3: Responsavel legal obrigatorio para < 18
      if (idade < 18 && (!responsavelLegal || responsavelLegal.trim() === '')) {
        throw 'RN: Responsavel legal e obrigatorio para alunos menores de 18 anos.';
      }
    }
  }

  static async create(req) {
    this.verificarRegrasDeNegocio(req);
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
    this.verificarRegrasDeNegocio(req);
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
