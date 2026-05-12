import { Model, DataTypes } from 'sequelize'; 

class Estado extends Model {

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
          notNull: { msg: 'O nome do estado deve ser preenchido!' },
          notEmpty: { msg: 'O nome do estado nao pode ser vazio!' },
          len: { args: [2, 50], msg: 'O nome do estado deve ter entre 2 e 50 caracteres!' },
          is: { args: [/^[a-zA-ZÀ-ÿ\s]+$/], msg: 'O nome do estado não deve conter números ou caracteres especiais!' }
        }
      },
      siglaUF: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'A sigla UF deve ser preenchida!' },
          notEmpty: { msg: 'A sigla UF nao pode ser vazia!' },
          len: { args: [2, 2], msg: 'A sigla UF deve possuir exatamente 2 caracteres!' }
        }
      }
    }, {
      sequelize,
      modelName: 'estado',
      tableName: 'estados',
      timestamps: false 
    });
  }

  static associate(models) {
    this.hasMany(models.cidade, { as: 'cidades', foreignKey: 'estadoId' });
  }
  
}

export { Estado };
