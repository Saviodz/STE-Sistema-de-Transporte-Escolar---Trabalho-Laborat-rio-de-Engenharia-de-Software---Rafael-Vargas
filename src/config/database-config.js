/*
// Configuração do banco de dados no ambiente de teste
export const databaseConfig = {
  dialect: 'sqlite',
  storage: 'database.sqlite',
  define: {
    timestamps: true, //adiciona os campos createdAt e updatedAt automaticamente
    freezeTableName: true, //não pluraliza o nome da tabela
    underscored: true //usa snake_case para os nomes dos campos
  }
};

*/


// Configuração do banco de dados no ambiente de desenvolvimento
export const databaseConfig = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: '1234',
  database: 'STE-Sistema-de-Transporte-Escolar',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  }
};


/*
// Configuração do banco de dados no ambiente de produção
export const databaseConfig = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'scv-backend-node-sequelize',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  }
};
*/