import { RegistroAcesso } from '../models/RegistroAcesso.js';
import { Op } from 'sequelize';
import sequelize from '../config/database-connection.js';

class RegistroAcessoService {
  // Padroniza o tipo recebido para evitar divergencias como "embarque" e "EMBARQUE".
  static normalizarTipo(tipo) {
    return typeof tipo === 'string' ? tipo.trim().toUpperCase() : tipo;
  }

  // Monta o intervalo completo do dia para consultar os registros daquele aluno.
  static obterPeriodoDoDia(dataHora) {
    const data = new Date(dataHora);
    if (Number.isNaN(data.getTime())) return null;

    const inicio = new Date(data);
    inicio.setHours(0, 0, 0, 0);

    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + 1);

    return { data, inicio, fim };
  }

  static async buscarRegistrosDoDia(alunoId, dataHora, registroAtualId = null) {
    // Descobre o inicio e o fim do dia informado no registro.
    const periodo = this.obterPeriodoDoDia(dataHora);
    if (periodo == null) return null;

    // Filtra todos os registros do aluno dentro do mesmo dia.
    const where = {
      alunoId,
      dataHora: {
        [Op.gte]: periodo.inicio,
        [Op.lt]: periodo.fim
      }
    };

    // No update, ignora o proprio registro para nao contar ele duas vezes.
    if (registroAtualId != null) {
      where.codigo = { [Op.ne]: registroAtualId };
    }

    // Busca no banco o historico do aluno no dia para validar RN01 e RN02.
    const registrosDoDia = await RegistroAcesso.findAll({ where });
    return { registrosDoDia, dataRegistro: periodo.data };
  }

  static async findAll() {
    const objs = await RegistroAcesso.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params; 
    const obj = await RegistroAcesso.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    // Recebe os dados do acesso enviados pela requisicao.
    const { tipo, dataHora, alunoId, viagemId } = req.body;

    // Normaliza o tipo antes de validar e persistir.
    const tipoNormalizado = this.normalizarTipo(tipo);

    // Executa as regras de negocio antes de abrir a transacao.
    if (await this.verificarRegrasDeNegocio(req)) {
      // Inicia a transacao do Sequelize para a gravacao do registro.
      const t = await sequelize.transaction();
      try {
        // Cria e salva o RegistroAcesso dentro da transacao aberta.
        const obj = await RegistroAcesso.create({
          tipo: tipoNormalizado,
          dataHora,
          alunoId,
          viagemId
        }, { transaction: t });

        // Confirma a transacao quando a gravacao termina com sucesso.
        await t.commit();

        // Retorna o registro recarregado com os relacionamentos do include.
        return await RegistroAcesso.findByPk(obj.codigo, { include: { all: true, nested: true } });
      } catch (error) {
        // Desfaz a transacao se qualquer etapa da gravacao falhar.
        await t.rollback();
        throw "Erro ao registrar o acesso!";
      }
    }
  }

  // ==========================================
  // Verificacao das Regras de Negocio
  // ==========================================
  static async verificarRegrasDeNegocio(req, registroAtualId = null) {
    // Recebe os dados necessarios para aplicar as RN do registro de acesso.
    const { tipo, dataHora, alunoId, viagemId } = req.body;

    // RF41 Regra 8: Não permitir acesso para alunos não vinculados à rota da viagem.
    const { Viagem } = (await import('../models/Viagem.js'));
    const { MatriculaTransporte } = (await import('../models/MatriculaTransporte.js'));
    const viagem = await Viagem.findByPk(viagemId);
    if (!viagem) throw 'Viagem não encontrada!';
    
    const matricula = await MatriculaTransporte.findOne({
      where: { alunoId, rotaId: viagem.rotaId }
    });
    if (!matricula) {
      throw 'RN: O aluno não possui matrícula ativa na rota correspondente a esta viagem.';
    }

    // Normaliza o tipo para validar sempre com o mesmo padrao.
    const tipoNormalizado = this.normalizarTipo(tipo);

    // Busca o historico do aluno no dia para tomar decisao sobre embarque e desembarque.
    const resultadoBusca = await this.buscarRegistrosDoDia(alunoId, dataHora, registroAtualId);

    if (resultadoBusca == null) return true;

    // Separa o conjunto retornado em totais que alimentam as regras RN01 e RN02.
    const { registrosDoDia, dataRegistro } = resultadoBusca;
    const embarquesDoDia = registrosDoDia.filter(r => this.normalizarTipo(r.tipo) === 'EMBARQUE').length;
    
    const registrosPrevios = registrosDoDia.filter(
      r => new Date(r.dataHora) < dataRegistro
    );

    const embarquesPrevios = registrosPrevios.filter(
      r => this.normalizarTipo(r.tipo) === 'EMBARQUE'
    ).length;

    const desembarquesPrevios = registrosPrevios.filter(
      r => this.normalizarTipo(r.tipo) === 'DESEMBARQUE'
    ).length;

    // RN01: impede que o aluno tenha mais de 2 embarques no mesmo dia.
    if (tipoNormalizado === 'EMBARQUE' && embarquesDoDia >= 2) {
      throw 'RN01: O aluno nao pode registrar mais de 2 embarques no mesmo dia.';
    }

    // RN02: so permite desembarque se existir embarque previo ainda sem par correspondente.
    if (tipoNormalizado === 'DESEMBARQUE' && embarquesPrevios <= desembarquesPrevios) {
      throw 'RN02: O aluno nao pode registrar desembarque sem um embarque previo em aberto no mesmo dia.';
    }

    return true;
  }

  static async update(req) {
    const { id } = req.params;
    const { tipo, dataHora, alunoId, viagemId } = req.body;

    // Busca o registro atual que sera alterado.
    const obj = await RegistroAcesso.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'Registro de acesso nao encontrado!';

    // Reaplica as mesmas regras do create, ignorando o proprio registro na contagem.
    await this.verificarRegrasDeNegocio(req, id);

    // Atualiza os campos do registro com os novos dados validados.
    Object.assign(obj, {
      tipo: this.normalizarTipo(tipo),
      dataHora,
      alunoId,
      viagemId
    });

    // Persiste a alteracao no banco.
    await obj.save();
    return await RegistroAcesso.findByPk(obj.codigo, { include: { all: true, nested: true } });
  }

  static async delete(req) {
    const { id } = req.params;

    // Localiza o registro antes de tentar excluir.
    const obj = await RegistroAcesso.findByPk(id);
    if (obj == null) throw 'Registro de acesso nao encontrado!';
    try {
      // Remove o registro do banco quando nao ha impedimentos de integridade.
      await obj.destroy();
      return obj;
    } catch (error) {
      throw 'Nao e possivel remover um registro de acesso com vinculos existentes.';
    }
  }
}

export { RegistroAcessoService };
