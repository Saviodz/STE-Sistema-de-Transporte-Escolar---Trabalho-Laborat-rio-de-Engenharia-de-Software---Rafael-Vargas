import { Model, DataTypes } from 'sequelize';

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  let resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

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
        allowNull: false,
        validate: {
          is: { args: [/^[a-zA-ZÀ-ÿ\s]+$/], msg: 'O nome não deve conter números ou caracteres especiais!' }
        }
      },
      cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isCpfValido(value) {
            if (!validarCPF(value)) {
              throw new Error('O CPF informado não é válido!');
            }
          }
        }
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
   
  }
  
}

export { Motorista };
