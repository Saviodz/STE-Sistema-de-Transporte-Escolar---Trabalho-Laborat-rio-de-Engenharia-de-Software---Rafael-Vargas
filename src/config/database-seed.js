import sequelize, { databaseInserts } from './database-connection.js';

await databaseInserts();
await sequelize.close();
