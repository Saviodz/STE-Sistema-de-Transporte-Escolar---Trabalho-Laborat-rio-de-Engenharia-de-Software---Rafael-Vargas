// Configuracao do banco de dados no ambiente de producao (Render PostgreSQL)
export const databaseConfig = {
  dialect: 'postgres',
  host: 'dpg-d8en40ernols73afnqa0-a.oregon-postgres.render.com',
  port: 5432,
  username: 'ste_sistema_de_transporte_escolar',
  password: 'Vj8c6gJfU5WVRu0mbyuwIBzKZCYwp1ME',
  database: 'ste_sistema_de_transporte_escolar',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  },
  dialectOptions: {
    ssl: true
  }
};

// Configuração do banco de dados no ambiente de teste (SQLite local)
/*export const databaseConfig = {
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
