import { Aluno } from '../models/Aluno.js';
import { MatriculaTransporte } from '../models/MatriculaTransporte.js';
import sequelize from '../config/database-connection.js';
import { QueryTypes } from 'sequelize';

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

  static async findQuantidadesAlunosOfInstituicoesBySituacao() {
    const objs = await sequelize.query(
      `SELECT instituicoes_ensino.nome AS instituicao,
              alunos.situacao_acesso AS situacao,
              COUNT(alunos.codigo) AS quantidade
       FROM alunos
       INNER JOIN instituicoes_ensino ON alunos.instituicao_ensino_id = instituicoes_ensino.codigo
       GROUP BY instituicoes_ensino.nome, alunos.situacao_acesso
       ORDER BY instituicoes_ensino.nome ASC, alunos.situacao_acesso ASC`,
      { type: QueryTypes.SELECT }
    );

    return objs;
  }

  static async alunosPorRota(req) {
    const { rotaId } = req.params;
    const { prefeituraId } = req.query;

    const whereMatricula = {};
    if (rotaId && rotaId !== 'Todos') {
      whereMatricula.rotaId = rotaId;
    }

    const whereAluno = {};
    if (prefeituraId && prefeituraId !== 'Todos') {
      whereAluno.prefeituraId = prefeituraId;
    }

    const matriculas = await MatriculaTransporte.findAll({
      where: whereMatricula,
      include: [
        {
          association: 'aluno',
          where: whereAluno,
          required: true,
          include: { all: true, nested: true }
        }
      ]
    });

    // Retorna os dados mapeados para compatibilidade com o frontend
    return matriculas.map(m => {
      const a = m.aluno.toJSON ? m.aluno.toJSON() : m.aluno;
      // Anexa os dados da matrícula e rota para exibição rica no frontend
      a.matriculaCodigo = m.codigo;
      return a;
    });
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
