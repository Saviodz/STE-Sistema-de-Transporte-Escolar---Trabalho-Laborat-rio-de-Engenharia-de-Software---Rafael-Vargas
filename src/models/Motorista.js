import { Model, DataTypes } from 'sequelize';

class Motorista extends Model {

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
      cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      cnh: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      validadeCNH: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: 'A validade da CNH deve estar no formato yyyy-MM-dd!' }
        }
      },
      categoriaCNH: {
        type: DataTypes.STRING,
        allowNull: false
      },
      telefones: {
        type: DataTypes.STRING,
        allowNull: false
      },
      situacao: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'motorista',
      tableName: 'motoristas',
      timestamps: false
    });
  }

  static associate(models) {
    this.hasMany(models.viagem, {
      as: 'viagens',
      foreignKey: {
        name: 'motoristaId',
        allowNull: false
      }
    });
  }
  
}

export { Motorista };
