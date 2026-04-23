import { Model, DataTypes } from 'sequelize';

class InstituicaoEnsino extends Model {

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
      endereco: {
        type: DataTypes.STRING,
        allowNull: false
      },
      telefones: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tipoInstituicao: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'instituicaoEnsino',
      tableName: 'instituicoes_ensino',
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
          notNull: { msg: 'A cidade da instituicao deve ser preenchida!' }
        }
      }
    });
  
  }
  
}

export { InstituicaoEnsino };
