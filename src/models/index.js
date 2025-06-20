import { Sequelize } from 'sequelize';

const DATABASE_URL = process.env.DATABASE_URL;

const sequelize = new Sequelize(DATABASE_URL, {
   dialect: 'postgres',
   dialectOptions: {
      ssl: {
         require: true, // Use SSL for Render
         rejectUnauthorized: false,
      },
   },
   logging: false,
});

import { UserModel } from './users.js';
import { ContactModel } from './contacts.js';
import { SpamModel } from './spams.js';

const User = UserModel(sequelize);
const Contact = ContactModel(sequelize);
const Spam = SpamModel(sequelize);

User.hasMany(Contact, {
   foreignKey: 'userId',
   as: 'contacts',
});

Contact.belongsTo(User, {
   foreignKey: 'userId',
   as: 'user',
});

User.hasMany(Spam, {
   foreignKey: 'userId',
   as: 'spams',
});

Spam.belongsTo(User, {
   foreignKey: 'userId',
   as: 'user',
});

export { sequelize , User , Contact , Spam };
