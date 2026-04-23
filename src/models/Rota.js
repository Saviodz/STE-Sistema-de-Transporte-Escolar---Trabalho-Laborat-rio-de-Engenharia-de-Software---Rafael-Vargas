import { Model, DataTypes } from 'sequelize';

class Rota extends Model {

  static init(sequelize) {
    super.init({
      codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      turno: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: false
      },
      observacao: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'rota',
      tableName: 'rotas',
      timestamps: false
    });
  }

  static associate(models) {
    this.belongsTo(models.cidade, {
      as: 'origem',
      foreignKey: {
        name: 'origemId',
        allowNull: false,
        validate: {
          notNull: { msg: 'A cidade de origem da rota deve ser preenchida!' }
        }
      }
    });
    this.belongsTo(models.cidade, {
      as: 'destino',
      foreignKey: {
        name: 'destinoId',
        allowNull: false,
        validate: {
          notNull: { msg: 'A cidade de destino da rota deve ser preenchida!' }
        }
      }
    });
  }
  
}

export { Rota };
