import { INTEGER, STRING } from 'sequelize';

import { postgresClient } from '../clients';

const User = postgresClient.define('user', {
  id: {
    type: INTEGER,
    primaryKey: true,
  },
  permalink: {
    type: STRING,
    allowNull: false,
    unique: true,
  }
}, {
  hooks: {
    beforeCreate: (user) => {
      user.permalink = user.permalink.toLowerCase();
    },
  },
});

export default User;
