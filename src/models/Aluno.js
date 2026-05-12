import { Model, DataTypes } from 'sequelize';

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  let resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

class Aluno extends Model {

  static init(sequelize) {
    super.init({
      codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: { args: [/^[a-zA-ZÀ-ÿ\s]+$/], msg: 'O nome não deve conter números ou caracteres especiais!' }
        }
      },
      foto: {
        type: DataTypes.BLOB('long'),
        allowNull: true
      },
      cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isCpfValido(value) {
            if (!validarCPF(value)) {
              throw new Error('O CPF informado não é válido!');
            }
          }
        }
      },
      dataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: 'A data de nascimento deve estar no formato yyyy-MM-dd!' }
        }
      },
      endereco: {
        type: DataTypes.STRING,
        allowNull: false
      },
      telefones: {
        type: DataTypes.STRING,
        allowNull: false
      },
      responsavelLegal: {
        type: DataTypes.STRING,
        allowNull: true
      },
      situacaoAcesso: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'aluno',
      tableName: 'alunos',
      timestamps: false
    });
  }

  static associate(models) {
    this.belongsTo(models.prefeitura, {
      as: 'prefeitura',
      foreignKey: {
        name: 'prefeituraId',
        allowNull: false,
        validate: {
          notNull: { msg: 'A prefeitura autorizadora do aluno deve ser preenchida!' }
        }
      }
    });
    this.belongsTo(models.instituicaoEnsino, {
      as: 'instituicaoEnsino',
      foreignKey: {
        name: 'instituicaoEnsinoId',
        allowNull: false,
        validate: {
          notNull: { msg: 'A instituicao de ensino do aluno deve ser preenchida!' }
        }
      }
    });
    this.hasMany(models.matriculaTransporte, {
      as: 'matriculas',
      foreignKey: 'alunoId'
    });
  }
  
}

export { Aluno };
