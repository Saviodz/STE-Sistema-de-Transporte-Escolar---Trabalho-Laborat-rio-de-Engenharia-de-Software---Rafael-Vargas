import { Model, DataTypes } from 'sequelize';

class RegistroAcesso extends Model {

  static init(sequelize) {
    super.init({
      codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dataHora: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: { msg: 'A data e hora do registro de acesso deve ser valida!' }
        }
      }
    }, {
      sequelize,
      modelName: 'registroAcesso',
      tableName: 'registros_acesso',
      timestamps: false
    });
  }

  static associate(models) {
    this.belongsTo(models.aluno, {
      as: 'aluno',
      foreignKey: {
        name: 'alunoId',
        allowNull: false,
        validate: {
          notNull: { msg: 'O aluno do registro de acesso deve ser preenchido!' }
        }
      }
    });
    this.belongsTo(models.viagem, {
      as: 'viagem',
      foreignKey: {
        name: 'viagemId',
        allowNull: false,
        validate: {
          notNull: { msg: 'A viagem do registro de acesso deve ser preenchida!' }
        }
      }
    });
  }
  
}

export { RegistroAcesso };
