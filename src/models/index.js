import { Sequelize } from 'sequelize';

const DATABASE_URL = process.env.DATABASE_URL;
console.log(DATABASE_URL);

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

const User = UserModel(sequelize);
const Contact = ContactModel(sequelize);

User.hasMany(Contact, {
   foreignKey: 'userId',
   as: 'contacts',
});

Contact.belongsTo(User, {
   foreignKey: 'userId',
   as: 'user',
});

export { sequelize };
