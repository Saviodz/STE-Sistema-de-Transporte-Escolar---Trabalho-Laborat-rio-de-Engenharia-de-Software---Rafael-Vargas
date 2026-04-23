import { Model, DataTypes } from 'sequelize';

class Onibus extends Model {

  static init(sequelize) {
    super.init({
      codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      placa: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      modelo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      capacidade: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ano: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      situacao: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'onibus',
      tableName: 'onibus',
      timestamps: false
    });
  }

  static associate(models) {
    
  }

}

export { Onibus };
