import { Model, DataTypes } from 'sequelize';

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
        allowNull: false
      },
      foto: {
        type: DataTypes.BLOB('long'),
        allowNull: true
      },
      cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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

  }
  
}

export { Aluno };
