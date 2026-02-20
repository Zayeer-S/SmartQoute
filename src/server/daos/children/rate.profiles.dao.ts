import type { Knex } from 'knex';
import { BaseDAO } from '../base/base.dao.js';
import { MAIN_TABLES } from '../../database/config/table-names.js';
import type { RateProfile } from '../../database/types/tables.js';
import type { RateProfileId } from '../../database/types/ids.js';

export class RateProfilesDAO extends BaseDAO<RateProfile, RateProfileId> {
  constructor(db: Knex) {
    super(
      {
        tableName: MAIN_TABLES.RATE_PROFILES,
        primaryKey: 'id',
        hasActivation: true,
      },
      db
    );
  }
}
