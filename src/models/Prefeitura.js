import { Model, DataTypes } from 'sequelize';

class Prefeitura extends Model {

  static init(sequelize) {
    super.init({
      codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      razaoSocial: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'A razao social da prefeitura deve ser preenchida!' },
          notEmpty: { msg: 'A razao social da prefeitura nao pode ser vazia!' }
        }
      },
      cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: 'O CNPJ da prefeitura deve ser preenchido!' },
          notEmpty: { msg: 'O CNPJ da prefeitura nao pode ser vazio!' }
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: { msg: 'O email da prefeitura deve ser valido!' }
        }
      }
    }, {
      sequelize,
      modelName: 'prefeitura',
      tableName: 'prefeituras',
      timestamps: false
    });
  }

  static associate(models) {
    this.belongsTo(models.cidade, {
      as: 'cidade',
      foreignKey: {
        name: 'cidadeId',
        allowNull: false,
        validate: {
          notNull: { msg: 'A cidade da prefeitura deve ser preenchida!' }
        }
      }
    });
    this.hasMany(models.aluno, {
      as: 'alunos',
      foreignKey: {
        name: 'prefeituraId',
        allowNull: false
      }
    });
  }
  
}

export { Prefeitura };
