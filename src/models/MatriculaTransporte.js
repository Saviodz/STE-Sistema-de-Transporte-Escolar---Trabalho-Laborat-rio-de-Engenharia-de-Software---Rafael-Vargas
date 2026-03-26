import { Model, DataTypes } from 'sequelize';

class MatriculaTransporte extends Model {

  static init(sequelize) {
    super.init({
      codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    }, {
      sequelize,
      modelName: 'matriculaTransporte',
      tableName: 'matriculas_transporte',
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
          notNull: { msg: 'O aluno da matricula de transporte deve ser preenchido!' }
        }
      }
    });
    this.belongsTo(models.rota, {
      as: 'rota',
      foreignKey: {
        name: 'rotaId',
        allowNull: false,
        validate: {
          notNull: { msg: 'A rota da matricula de transporte deve ser preenchida!' }
        }
      }
    });
  }
  
}

export { MatriculaTransporte };
