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
UF.hasMany(Cidade, { as: "cidades" });
Cidade.belongsTo(UF);
Prefeitura.belongsTo(Cidade);

(async () => {
    await sequelize.sync({ force: true }); // para sincronizar automaticamente todos os modelos

    // Inserindo uma UF e duas cidades para, depois, vincular as cidades à UF
    const uf1 = await UF.create({ nome: "São Paulo", siglaUF: "SP" });
    const cidade1 = await Cidade.create({ nome: "Campinas" });
    const cidade2 = await Cidade.create({ nome: "Sorocaba" });
    await uf1.setCidades([cidade1, cidade2]);

    // Inserindo uma cidade já com informação da UF
    const cidade3 = await Cidade.create({ nome: "Santos", ufCodigo: uf1.codigo });

    console.log("UF e cidades salvas no banco de dados!\n\n");

    // Inserindo uma prefeitura para, depois, vincular à cidade
    const prefeitura1 = await Prefeitura.create({
        razaoSocial: "Prefeitura Municipal de Campinas",
        cnpj: "12.345.678/0001-90"
    });
    await prefeitura1.setCidade(cidade1);

    // Inserindo uma prefeitura já com informação da cidade
    const prefeitura2 = await Prefeitura.create({
        razaoSocial: "Prefeitura Municipal de Santos",
        cnpj: "98.765.432/0001-10",
        cidadeCodigo: cidade3.codigo
    });

    console.log("Prefeituras salvas no banco de dados!\n\n");

    // Listando todas as UFs, incluindo suas cidades
    const ufs1 = await UF.findAll({ include: "cidades" });
    console.log("\nUF.findAll({ include: 'cidades' }):\n", JSON.stringify(ufs1, null, 2), "\n\n");

    // Listando todas as prefeituras, incluindo sua cidade
    const prefeituras1 = await Prefeitura.findAll({ include: Cidade });
    console.log("Prefeitura.findAll({ include: Cidade }):\n", JSON.stringify(prefeituras1, null, 2));

    await prefeitura2.reload();
})();
