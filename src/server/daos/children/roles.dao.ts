import type { Knex } from 'knex';
import type { Role } from '../../database/types/tables.js';
import type { RoleId } from '../../database/types/ids.js';
import { LookupTableDAO } from '../base/lookup.table.dao.js';
import { LOOKUP_TABLES } from '../../database/config/table-names.js';

export class RolesDAO extends LookupTableDAO<Role, RoleId> {
  constructor(db: Knex) {
    super(
      {
        tableName: LOOKUP_TABLES.ROLES,
        primaryKey: 'id',
      },
      db
    );
  }
}
