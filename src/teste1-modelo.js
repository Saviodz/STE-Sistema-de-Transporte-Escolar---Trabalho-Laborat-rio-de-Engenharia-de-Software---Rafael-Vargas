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
                type: DataTypes.STRING
            },
            siglaUF: {
                type: DataTypes.STRING
            }
        }, { sequelize, modelName: "uf", tableName: "ufs" });
    }
}

// Inicializando o modelo (CREATE TABLE)
UF.init(sequelize);

(async () => {
    await sequelize.sync({ force: true }); // Sincronizando automaticamente todos os modelos

    // Instanciando um objeto
    const uf1 = UF.build({ nome: "São Paulo", siglaUF: "SP" });
    console.log(uf1 instanceof UF); // true
    console.log(uf1.nome); // "São Paulo"

    // Inserindo um objeto no banco de dados (primeira maneira)
    await uf1.save();
    console.log("UF São Paulo foi salva no banco de dados!\n\n");

    // Inserindo objetos no banco de dados (segunda maneira)
    const uf2 = await UF.create({ nome: "Rio de Janeiro", siglaUF: "RJ" });
    const uf3 = await UF.create({ nome: "Minas Gerais", siglaUF: "MG" });
    const uf4 = await UF.create({ nome: "Paraná", siglaUF: "PR" });
    console.log("UFs salvas no banco de dados!\n\n");

    // Atualizando um objeto
    uf1.nome = "São Paulo - Atualizado";
    await uf1.save();
    console.log("UF São Paulo atualizada no banco de dados!\n\n");

    // Deletando um objeto
    await uf2.destroy();
    console.log("UF Rio de Janeiro (codigo: 2) removida do banco de dados!\n\n");

    // findAll: listando todos
    const ufs1 = await UF.findAll();
    console.log(ufs1.every((uf) => uf instanceof UF)); // true
    console.log("findAll():\n", JSON.stringify(ufs1, null, 2), "\n\n");

    // findAll: listando todos (especificando atributos para SELECT)
    const ufs2 = await UF.findAll({ attributes: ["nome", "siglaUF"] });
    console.log("findAll({ attributes: ['nome', 'siglaUF'] }):\n", JSON.stringify(ufs2, null, 2), "\n\n");

    // findAll: listando todos (WHERE)
    const ufs3 = await UF.findAll({ where: { codigo: 3 } });
    console.log("findAll({ where: { codigo: 3 } }):\n", JSON.stringify(ufs3, null, 2), "\n\n");

    // findByPk: listando por chave primária
    const ufs4 = await UF.findByPk(3);
    console.log("findByPk(3):\n", JSON.stringify(ufs4, null, 2), "\n\n");

    // findOne
    const ufs5 = await UF.findOne({ where: { siglaUF: "MG" } });
    console.log("findOne({ where: { siglaUF: 'MG' } }):\n", JSON.stringify(ufs5, null, 2), "\n\n");
})();
