import { Model, DataTypes } from 'sequelize';

class Cidade extends Model {

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
          notNull: { msg: 'O nome da cidade deve ser preenchido!' },
          notEmpty: { msg: 'O nome da cidade nao pode ser vazio!' },
          len: { args: [2, 60], msg: 'O nome da cidade deve ter entre 2 e 60 caracteres!' }
        }
      }
    }, {
      sequelize,
      modelName: 'cidade',
      tableName: 'cidades',
      timestamps: false
    });
  }

  static associate(models) {
    this.belongsTo(models.estado, {
      as: 'estado',
      foreignKey: {
        name: 'estadoId',
        allowNull: false,
        validate: {
          notNull: { msg: 'O estado da cidade deve ser preenchido!' }
        }
      }
    });
    this.hasMany(models.prefeitura, {
      as: 'prefeituras',
      foreignKey: {
        name: 'cidadeId',
        allowNull: false
      }
    });
    this.hasMany(models.instituicaoEnsino, {
      as: 'instituicoesEnsino',
      foreignKey: {
        name: 'cidadeId',
        allowNull: false
      }
    });
    this.hasMany(models.rota, {
      as: 'rotasOrigem',
      foreignKey: {
        name: 'origemId',
        allowNull: false
      }
    });
    this.hasMany(models.rota, {
      as: 'rotasDestino',
      foreignKey: {
        name: 'destinoId',
        allowNull: false
      }
    });
  }
  
}

export { Cidade };
