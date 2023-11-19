import * as Knex from 'knex';
import * as knexConfig from 'src/database/knexfile';

module.exports = Knex.default(knexConfig);
