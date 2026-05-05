import { MatriculaTransporte } from '../models/MatriculaTransporte.js';
import { RegistroAcesso } from '../models/RegistroAcesso.js';
import { Op } from 'sequelize';

class RelatorioService {
  // Relatório de Alunos por Rota
  static async alunosPorRota(req) {
    const { rotaId } = req.params;
    const matriculas = await MatriculaTransporte.findAll({
      where: { rotaId: rotaId },
      include: { all: true, nested: true }
    });
    // Retorna apenas os objetos de Aluno mapeados
    return matriculas.map(m => m.Aluno);
  }

  // Relatório de Acessos por Período
  static async acessosPorPeriodo(req) {
    const { dataInicial, dataFinal } = req.query;
    if (!dataInicial || !dataFinal) {
      throw "Parâmetros 'dataInicial' e 'dataFinal' são obrigatórios na query string!";
    }
    const registros = await RegistroAcesso.findAll({
      where: {
        dataHora: {
          [Op.between]: [`${dataInicial}T00:00:00`, `${dataFinal}T23:59:59`]
        }
      },
      include: { all: true, nested: true },
      order: [['dataHora', 'ASC']]
    });
    return registros;
  }
}

export { RelatorioService };
