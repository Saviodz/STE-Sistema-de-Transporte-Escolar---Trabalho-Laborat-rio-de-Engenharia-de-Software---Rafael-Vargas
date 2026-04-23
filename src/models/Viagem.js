import { Model, DataTypes } from 'sequelize';

class Viagem extends Model {

  static init(sequelize) {
    super.init({
      codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      data: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: 'A data da viagem deve estar no formato yyyy-MM-dd!' }
        }
      },
      horarioSaida: {
        type: DataTypes.STRING,
        allowNull: false
      },
      horarioChegada: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'viagem',
      tableName: 'viagens',
      timestamps: false
    });
  }

  static associate(models) {
    this.belongsTo(models.rota, {
      as: 'rota',
      foreignKey: {
        name: 'rotaId',
        allowNull: false,
        validate: {
          notNull: { msg: 'A rota da viagem deve ser preenchida!' }
        }
      }
    });
    this.belongsTo(models.motorista, {
      as: 'motorista',
      foreignKey: {
        name: 'motoristaId',
        allowNull: false,
        validate: {
          notNull: { msg: 'O motorista da viagem deve ser preenchido!' }
        }
      }
    });
    this.belongsTo(models.onibus, {
      as: 'onibus',
      foreignKey: {
        name: 'onibusId',
        allowNull: false,
        validate: {
          notNull: { msg: 'O onibus da viagem deve ser preenchido!' }
        }
      }
    });

  }
  
}

export { Viagem };
