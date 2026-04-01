import Sequelize from 'sequelize';
import { databaseConfig } from './database-config.js';

import { Aluno } from '../models/Aluno.js';
import { Cidade } from '../models/Cidade.js';
import { Estado } from '../models/Estado.js';
import { InstituicaoEnsino } from '../models/InstituicaoEnsino.js';
import { MatriculaTransporte } from '../models/MatriculaTransporte.js';
import { Motorista } from '../models/Motorista.js';
import { Onibus } from '../models/Onibus.js';
import { Prefeitura } from '../models/Prefeitura.js';
import { RegistroAcesso } from '../models/RegistroAcesso.js';
import { Rota } from '../models/Rota.js';
import { Viagem } from '../models/Viagem.js';

const sequelize = new Sequelize(databaseConfig);

Estado.init(sequelize);
Cidade.init(sequelize);
Prefeitura.init(sequelize);
InstituicaoEnsino.init(sequelize);
Aluno.init(sequelize);
Motorista.init(sequelize);
Onibus.init(sequelize);
Rota.init(sequelize);
Viagem.init(sequelize);
MatriculaTransporte.init(sequelize);
RegistroAcesso.init(sequelize);

Estado.associate(sequelize.models);
Cidade.associate(sequelize.models);
Prefeitura.associate(sequelize.models);
InstituicaoEnsino.associate(sequelize.models);
Aluno.associate(sequelize.models);
Motorista.associate(sequelize.models);
Onibus.associate(sequelize.models);
Rota.associate(sequelize.models);
Viagem.associate(sequelize.models);
MatriculaTransporte.associate(sequelize.models);
RegistroAcesso.associate(sequelize.models);

databaseInserts(); // comentar quando estiver em ambiente de producao (nao criar tabelas e nao inserir registros de teste)

function databaseInserts() {
  (async () => {
    await sequelize.sync({ force: true });

    const estado1 = await Estado.create({ siglaUF: 'ES', nome: 'Espirito Santo' });
    const estado2 = await Estado.create({ siglaUF: 'MG', nome: 'Minas Gerais' });
    const estado3 = await Estado.create({ siglaUF: 'RJ', nome: 'Rio de Janeiro' });

    const cidade1 = await Cidade.create({ nome: 'Cachoeiro de Itapemirim', estadoId: estado1.codigo });
    const cidade2 = await Cidade.create({ nome: 'Alegre', estadoId: estado1.codigo });
    const cidade3 = await Cidade.create({ nome: 'Castelo', estadoId: estado1.codigo });
    const cidade4 = await Cidade.create({ nome: 'Jeronimo Monteiro', estadoId: estado1.codigo });
    const cidade5 = await Cidade.create({ nome: 'Carangola', estadoId: estado2.codigo });
    const cidade6 = await Cidade.create({ nome: 'Itaperuna', estadoId: estado3.codigo });

    const prefeitura1 = await Prefeitura.create({
      razaoSocial: 'Prefeitura Municipal de Cachoeiro de Itapemirim',
      cnpj: '27.165.588/0001-90',
      endereco: 'Praca Jeronimo Monteiro, 32 - Centro',
      telefones: '(28) 3155-5000',
      email: 'transporte@cachoeiro.es.gov.br',
      cidadeId: cidade1.codigo
    });
    const prefeitura2 = await Prefeitura.create({
      razaoSocial: 'Prefeitura Municipal de Alegre',
      cnpj: '27.174.101/0001-35',
      endereco: 'Praca Getulio Vargas, 01 - Centro',
      telefones: '(28) 3552-4412',
      email: 'educacao@alegre.es.gov.br',
      cidadeId: cidade2.codigo
    });
    const prefeitura3 = await Prefeitura.create({
      razaoSocial: 'Prefeitura Municipal de Carangola',
      cnpj: '19.279.827/0001-04',
      endereco: 'Praca Coronel Maximiano, 88 - Centro',
      telefones: '(32) 3741-9600',
      email: 'transporte@carangola.mg.gov.br',
      cidadeId: cidade5.codigo
    });
    const prefeitura4 = await Prefeitura.create({
      razaoSocial: 'Prefeitura Municipal de Itaperuna',
      cnpj: '28.916.716/0001-52',
      endereco: 'Rua Izabel Vieira Martins, 131 - Cidade Nova',
      telefones: '(22) 3824-6300',
      email: 'educacao@itaperuna.rj.gov.br',
      cidadeId: cidade6.codigo
    });
    const prefeitura5 = await Prefeitura.create({
      razaoSocial: 'Prefeitura Municipal de Castelo',
      cnpj: '27.165.638/0001-39',
      endereco: 'Avenida Nossa Senhora da Penha, 103 - Centro',
      telefones: '(28) 3542-6300',
      email: 'educacao@castelo.es.gov.br',
      cidadeId: cidade3.codigo
    });
    const prefeitura6 = await Prefeitura.create({
      razaoSocial: 'Prefeitura Municipal de Jeronimo Monteiro',
      cnpj: '27.165.653/0001-87',
      endereco: 'Avenida Lourival Lougon Moulin, 300 - Centro',
      telefones: '(28) 3558-1120',
      email: 'transporte@jeronimomonteiro.es.gov.br',
      cidadeId: cidade4.codigo
    });

    const instituicao1 = await InstituicaoEnsino.create({
      nome: 'IFES Campus Cachoeiro de Itapemirim',
      endereco: 'Rodovia BR 482, Fazenda Morro Grande',
      telefones: '(28) 3526-9000',
      tipoInstituicao: 'Instituto Federal',
      cidadeId: cidade1.codigo
    });
    const instituicao2 = await InstituicaoEnsino.create({
      nome: 'Centro Universitario Sao Camilo',
      endereco: 'Rua Sao Camilo de Lellis, 01 - Paraiso',
      telefones: '(28) 3526-5900',
      tipoInstituicao: 'Universidade',
      cidadeId: cidade1.codigo
    });
    const instituicao3 = await InstituicaoEnsino.create({
      nome: 'UFES Campus de Alegre',
      endereco: 'Alto Universitario, s/n',
      telefones: '(28) 3552-8600',
      tipoInstituicao: 'Universidade',
      cidadeId: cidade2.codigo
    });
    const instituicao4 = await InstituicaoEnsino.create({
      nome: 'IFF Campus Itaperuna',
      endereco: 'BR 356, Km 3 - Cidade Nova',
      telefones: '(22) 3811-9200',
      tipoInstituicao: 'Instituto Federal',
      cidadeId: cidade6.codigo
    });

    const aluno1 = await Aluno.create({
      nome: 'Jose Carlos Ceccon Neto',
      cpf: '123.456.789-01',
      dataNascimento: '2005-01-07',
      endereco: 'Rua Dr. Bricio Mesquita, Cachoeiro de Itapemirim - ES',
      telefones: '(28) 99902-7087',
      responsavelLegal: ' ',
      situacaoAcesso: 'Ativo',
      prefeituraId: prefeitura1.codigo,
      instituicaoEnsinoId: instituicao1.codigo
    });
    const aluno2 = await Aluno.create({
      nome: 'Pedro Henrique Costa',
      cpf: '123.456.789-02',
      dataNascimento: '2006-08-21',
      endereco: 'Rua Antonio Machado, Castelo - ES',
      telefones: '(28) 99911-1002',
      responsavelLegal: 'Luciana Costa',
      situacaoAcesso: 'Ativo',
      prefeituraId: prefeitura5.codigo,
      instituicaoEnsinoId: instituicao2.codigo
    });
    const aluno3 = await Aluno.create({
      nome: 'Julia Martins Ferreira',
      cpf: '123.456.789-03',
      dataNascimento: '2005-11-09',
      endereco: 'Avenida do Contorno, Carangola - MG',
      telefones: '(32) 99911-1003',
      responsavelLegal: 'Carlos Ferreira',
      situacaoAcesso: 'Ativo',
      prefeituraId: prefeitura3.codigo,
      instituicaoEnsinoId: instituicao3.codigo
    });
    const aluno4 = await Aluno.create({
      nome: 'Gabriel Souza Rocha',
      cpf: '123.456.789-04',
      dataNascimento: '2007-01-30',
      endereco: 'Rua Vinhosa, Itaperuna - RJ',
      telefones: '(22) 99911-1004',
      responsavelLegal: 'Patricia Rocha',
      situacaoAcesso: 'Ativo',
      prefeituraId: prefeitura4.codigo,
      instituicaoEnsinoId: instituicao1.codigo
    });
    const aluno5 = await Aluno.create({
      nome: 'Beatriz Nascimento Lima',
      cpf: '123.456.789-05',
      dataNascimento: '2008-05-12',
      endereco: 'Rua Capitao Deslandes, Jeronimo Monteiro - ES',
      telefones: '(28) 99911-1005',
      responsavelLegal: 'Renato Lima',
      situacaoAcesso: 'Ativo',
      prefeituraId: prefeitura6.codigo,
      instituicaoEnsinoId: instituicao1.codigo
    });

    const motorista1 = await Motorista.create({
      nome: 'Marcos Vinicius Pires',
      cpf: '987.654.321-01',
      cnh: '05321478901',
      validadeCNH: '2028-07-15',
      categoriaCNH: 'D',
      telefones: '(28) 99988-2001',
      situacao: 'Ativo'
    });
    const motorista2 = await Motorista.create({
      nome: 'Roberto Carlos Vieira',
      cpf: '987.654.321-02',
      cnh: '05321478902',
      validadeCNH: '2027-11-20',
      categoriaCNH: 'D',
      telefones: '(28) 99988-2002',
      situacao: 'Ativo'
    });
    const motorista3 = await Motorista.create({
      nome: 'Sergio Mendes Lopes',
      cpf: '987.654.321-03',
      cnh: '05321478903',
      validadeCNH: '2029-02-10',
      categoriaCNH: 'E',
      telefones: '(22) 99988-2003',
      situacao: 'Ativo'
    });

    const onibus1 = await Onibus.create({
      placa: 'RTA-1A23',
      modelo: 'Marcopolo Volare V8L',
      capacidade: 32,
      ano: 2022,
      situacao: 'Ativo'
    });
    const onibus2 = await Onibus.create({
      placa: 'ESC-4B56',
      modelo: 'Mercedes-Benz OF 1519',
      capacidade: 44,
      ano: 2021,
      situacao: 'Ativo'
    });
    const onibus3 = await Onibus.create({
      placa: 'STE-7C89',
      modelo: 'Volksbus 15.190 ODR',
      capacidade: 48,
      ano: 2023,
      situacao: 'Ativo'
    });

    const rota1 = await Rota.create({
      turno: 'Matutino',
      descricao: 'Linha Alegre x Cachoeiro para estudantes do IFES',
      observacao: 'Atende tambem alunos de Jeronimo Monteiro',
      origemId: cidade2.codigo,
      destinoId: cidade1.codigo
    });
    const rota2 = await Rota.create({
      turno: 'Noturno',
      descricao: 'Linha Castelo x Cachoeiro para ensino superior',
      observacao: 'Retorno apos termino das aulas noturnas',
      origemId: cidade3.codigo,
      destinoId: cidade1.codigo
    });
    const rota3 = await Rota.create({
      turno: 'Matutino',
      descricao: 'Linha Carangola x Alegre para campus universitario',
      observacao: 'Integra estudantes do interior de MG',
      origemId: cidade5.codigo,
      destinoId: cidade2.codigo
    });
    const rota4 = await Rota.create({
      turno: 'Matutino',
      descricao: 'Linha Itaperuna x Cachoeiro para cursos tecnicos',
      observacao: 'Atende municipios do noroeste fluminense',
      origemId: cidade6.codigo,
      destinoId: cidade1.codigo
    });

    const viagem1 = await Viagem.create({
      data: '2026-04-01',
      horarioSaida: '05:40',
      horarioChegada: '07:10',
      rotaId: rota1.codigo,
      motoristaId: motorista1.codigo,
      onibusId: onibus1.codigo
    });
    const viagem2 = await Viagem.create({
      data: '2026-04-01',
      horarioSaida: '18:00',
      horarioChegada: '19:00',
      rotaId: rota2.codigo,
      motoristaId: motorista2.codigo,
      onibusId: onibus2.codigo
    });
    const viagem3 = await Viagem.create({
      data: '2026-04-02',
      horarioSaida: '05:20',
      horarioChegada: '06:50',
      rotaId: rota3.codigo,
      motoristaId: motorista1.codigo,
      onibusId: onibus2.codigo
    });
    const viagem4 = await Viagem.create({
      data: '2026-04-02',
      horarioSaida: '04:50',
      horarioChegada: '07:30',
      rotaId: rota4.codigo,
      motoristaId: motorista3.codigo,
      onibusId: onibus3.codigo
    });

    await MatriculaTransporte.create({ alunoId: aluno1.codigo, rotaId: rota1.codigo });
    await MatriculaTransporte.create({ alunoId: aluno2.codigo, rotaId: rota2.codigo });
    await MatriculaTransporte.create({ alunoId: aluno3.codigo, rotaId: rota3.codigo });
    await MatriculaTransporte.create({ alunoId: aluno4.codigo, rotaId: rota4.codigo });
    await MatriculaTransporte.create({ alunoId: aluno5.codigo, rotaId: rota1.codigo });

    await RegistroAcesso.create({
      tipo: 'EMBARQUE',
      dataHora: '2026-04-01T05:42:00',
      alunoId: aluno1.codigo,
      viagemId: viagem1.codigo
    });
    await RegistroAcesso.create({
      tipo: 'DESEMBARQUE',
      dataHora: '2026-04-01T07:08:00',
      alunoId: aluno1.codigo,
      viagemId: viagem1.codigo
    });
    await RegistroAcesso.create({
      tipo: 'EMBARQUE',
      dataHora: '2026-04-01T18:03:00',
      alunoId: aluno2.codigo,
      viagemId: viagem2.codigo
    });
    await RegistroAcesso.create({
      tipo: 'EMBARQUE',
      dataHora: '2026-04-02T05:23:00',
      alunoId: aluno3.codigo,
      viagemId: viagem3.codigo
    });
    await RegistroAcesso.create({
      tipo: 'EMBARQUE',
      dataHora: '2026-04-02T04:55:00',
      alunoId: aluno4.codigo,
      viagemId: viagem4.codigo
    });
    await RegistroAcesso.create({
      tipo: 'EMBARQUE',
      dataHora: '2026-04-01T05:44:00',
      alunoId: aluno5.codigo,
      viagemId: viagem1.codigo
    });
  })();
}

export default sequelize;
