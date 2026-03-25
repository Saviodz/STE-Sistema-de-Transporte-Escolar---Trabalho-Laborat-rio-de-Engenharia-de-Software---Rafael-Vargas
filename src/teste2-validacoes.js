const { Sequelize, Model, DataTypes } = require("sequelize");

// Abrindo conexão
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite"
});

// Definindo a classe de modelo
class UF extends Model {
    static init(sequelize) {
        super.init({
            codigo: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nome: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "O nome da UF deve ser preenchido!" },
                    len: { args: [2, 50], msg: "O nome da UF deve ter entre 2 e 50 caracteres!" }
                }
            },
            siglaUF: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "A sigla da UF deve ser preenchida!" },
                    len: { args: [2, 2], msg: "A sigla da UF deve ter exatamente 2 caracteres!" }
                }
            }
        }, { sequelize, modelName: "uf", tableName: "ufs" });
    }
}

// Inicializando o modelo (CREATE TABLE)
UF.init(sequelize);

(async () => {
    await sequelize.sync({ force: true }); // Sincronizando automaticamente todos os modelos

    // Inserindo uma UF válida
    const uf1 = await UF.create({ nome: "São Paulo", siglaUF: "SP" });
    console.log("UF válida inserida com sucesso!\n", JSON.stringify(uf1, null, 2), "\n");

    // Tentando inserir uma UF inválida
    try {
        await UF.create({ nome: "A", siglaUF: "S" });
    } catch (error) {
        console.log("Erro de validação ao inserir UF inválida:");
        console.log(error.name, "::", error.errors.map((item) => item.message).join(" | "));
    }
})();
