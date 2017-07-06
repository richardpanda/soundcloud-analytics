import { DATEONLY, Deferrable, NOW, INTEGER } from 'sequelize';

import User from './user';
import { postgresClient } from '../clients';

const Statistic = postgresClient.define('statistic', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: INTEGER,
    unique: 'compositeIndex',
    references: {
      model: User,
      key: 'id',
      deferrable: Deferrable.INITIALLY_IMMEDIATE,
    },
    allowNull: false,
    onDelete: 'cascade',
  },
  date: {
    type: DATEONLY,
    unique: 'compositeIndex',
    defaultValue: NOW,
  },
  followers: {
    type: INTEGER,
    allowNull: false,
  },
});

export default Statistic;
