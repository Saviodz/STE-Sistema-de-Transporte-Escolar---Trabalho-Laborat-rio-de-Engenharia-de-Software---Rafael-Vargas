// ============================================================================
// CONFIGURAÇÃO DO BANCO DE DADOS
// Para alternar o banco, comente o bloco atual e descomente o desejado.
// O banco padrão adotado para esta atividade foi o SQLite.
// ============================================================================

// 1. Configuração para SQLite (Padrão para avaliação rápida / local)
export const databaseConfig = {
  dialect: 'sqlite',
  storage: 'database.sqlite',
  define: {
    timestamps: true, // adiciona campos createdAt e updatedAt automaticamente
    freezeTableName: true, // não pluraliza o nome da tabela
    underscored: true // usa snake_case para os nomes dos campos
  }
};

// 2. Configuração para PostgreSQL (Opcional / Ambiente mais robusto)
/*
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
*/