import { DataTypes } from 'sequelize';

const ContactModel = (sequelize) => {
   const Contact = sequelize.define('Contact', {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      userId: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: 'Users', // correct only if table name is Users
            key: 'id',
         },
      },
      contactNumber: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true,
         validate: {
            len: {
               args: [10, 10],
               msg: 'Phone number should be exactly 10 digits',
            },
            isNumeric: {
               msg: 'Phone number should only contain digits',
            },
         },
      },
      contactName: {
         type: DataTypes.STRING,
         allowNull: false,
      },
   });

   return Contact;
};

export { ContactModel };
