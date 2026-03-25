const { Sequelize, Model, DataTypes } = require("sequelize");

// Abrindo conexão
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite"
});

// Definindo as classes de modelo
class UF extends Model {
    static init(sequelize) {
        super.init({
            codigo: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nome: DataTypes.STRING,
            siglaUF: DataTypes.STRING
        }, { sequelize, modelName: "uf", tableName: "ufs" });
    }
}

class Cidade extends Model {
    static init(sequelize) {
        super.init({
            codigo: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nome: DataTypes.STRING
        }, { sequelize, modelName: "cidade", tableName: "cidades" });
    }
}

class Prefeitura extends Model {
    static init(sequelize) {
        super.init({
            codigo: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            razaoSocial: DataTypes.STRING,
            cnpj: DataTypes.STRING
        }, { sequelize, modelName: "prefeitura", tableName: "prefeituras" });
    }
}

// Inicializando os modelos
UF.init(sequelize);
Cidade.init(sequelize);
Prefeitura.init(sequelize);

// Configurando as associações entre os modelos
UF.hasMany(Cidade, { as: "cidades", foreignKey: "ufCodigo", onDelete: "CASCADE", onUpdate: "CASCADE" });
Cidade.belongsTo(UF, { foreignKey: "ufCodigo" });
Prefeitura.belongsTo(Cidade, { foreignKey: "cidadeCodigo", onDelete: "RESTRICT", onUpdate: "RESTRICT" });
Cidade.hasMany(Prefeitura, { as: "prefeituras", foreignKey: "cidadeCodigo" });

(async () => {
    await sequelize.sync({ force: true }); // para sincronizar automaticamente todos os modelos

    // Inserindo uma UF e cidades vinculadas
    const uf1 = await UF.create({ nome: "São Paulo", siglaUF: "SP" });
    const cidade1 = await Cidade.create({ nome: "Campinas" });
    const cidade2 = await Cidade.create({ nome: "Sorocaba" });
    await uf1.setCidades([cidade1, cidade2]);

    // Inserindo uma prefeitura vinculada à cidade1
    const prefeitura1 = await Prefeitura.create({
        razaoSocial: "Prefeitura Municipal de Campinas",
        cnpj: "12.345.678/0001-90",
        cidadeCodigo: cidade1.codigo
    });

    console.log("UF, cidades e prefeitura salvas no banco de dados!\n\n");

    // Exibindo os dados antes da exclusão
    const ufs1 = await UF.findAll({ include: "cidades" });
    console.log("UF.findAll({ include: 'cidades' }):\n", JSON.stringify(ufs1, null, 2), "\n\n");

    // Tentando excluir a cidade que possui prefeitura vinculada
    try {
        await cidade1.destroy();
    } catch (error) {
        console.log("Erro ao excluir Campinas por causa do RESTRICT:");
        console.log(error.name, "::", error.parent?.code || error.message, "\n");
    }

    // Excluindo a cidade sem prefeitura vinculada
    await cidade2.destroy();
    console.log("Cidade Sorocaba removida com sucesso.\n");

    // Excluindo a prefeitura para liberar a exclusão da cidade1
    await prefeitura1.destroy();
    await cidade1.destroy();
    console.log("Cidade Campinas removida após excluir a prefeitura.\n");

    // Criando novas cidades para demonstrar CASCADE ao excluir a UF
    const cidade3 = await Cidade.create({ nome: "Santos", ufCodigo: uf1.codigo });
    const cidade4 = await Cidade.create({ nome: "Jundiaí", ufCodigo: uf1.codigo });
    console.log("Novas cidades criadas:", cidade3.nome, "e", cidade4.nome, "\n");

    // Excluindo a UF, o que remove automaticamente as cidades relacionadas
    await uf1.destroy();

    const cidadesRestantes = await Cidade.findAll();
    console.log("Cidades restantes após excluir a UF com CASCADE:\n", JSON.stringify(cidadesRestantes, null, 2));
})();
