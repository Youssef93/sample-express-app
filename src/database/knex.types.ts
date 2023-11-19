// Importing Knex is important for TS to add correct interfaces (even if it's not used).
// Otherwise it does not work properly
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  interface UserEntity {
    id: string;
  }

  interface Tables {
    user: UserEntity;
  }
}
