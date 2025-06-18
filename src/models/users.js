import { DataTypes } from 'sequelize';

const UserModel = (sequelize) => {
   const User = sequelize.define(
      'User',
      {
         id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
         },
         fullName: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
               len: {
                  args: [10, 10],
                  msg: 'Phone number should be exactly 10 digits',
               },
               isNumeric: {
                  msg: 'Phone number should contain only digits',
               },
            },
         },
         email: {
            type: DataTypes.STRING(100),
         },
         password: {
            type: DataTypes.STRING,
            allowNull: false,
         },
      },
      {
         sequelize, // pass the sequelize instance
         modelName: 'User', // pass the model name
      }
   );
   return User;
};

export { UserModel };
