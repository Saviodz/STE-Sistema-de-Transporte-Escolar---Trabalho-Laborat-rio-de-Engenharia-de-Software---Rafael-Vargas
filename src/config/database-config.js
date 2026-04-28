// Configuração do banco de dados no ambiente de teste (SQLite local)
export const databaseConfig = {
  dialect: 'sqlite',
  storage: 'database.sqlite',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  }
};

/*  ← PostgreSQL desativado temporariamente – reative para produção


// Configuração do banco de dados no ambiente de desenvolvimento (PostgreSQL)
// export const databaseConfig = {
//   dialect: 'postgres',
//   host: 'localhost',
//   username: 'postgres',
//   password: '1234',
//   database: 'STE-Sistema-de-Transporte-Escolar',
//   define: {
//     timestamps: true,
//     freezeTableName: true,
//     underscored: true
//   }
// };


*/

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