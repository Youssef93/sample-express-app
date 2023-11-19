import type { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'src/database/caseMappings';

const config: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: __dirname + '/migrations',
  },
  seeds: {
    directory: __dirname + '/seeds',
  },
  ...knexSnakeCaseMappers({}),
};

module.exports = config;
