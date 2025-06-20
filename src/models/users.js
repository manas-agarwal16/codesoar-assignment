import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

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
         refreshToken : {
            type: DataTypes.STRING,
            allowNull: true,
         },
      },
      {
         sequelize, // pass the sequelize instance
         modelName: 'User', // pass the model name
      }
   );

   User.beforeCreate(async (user) => {
      user.password = await bcrypt.hash(user.password, 8);
   });

   User.prototype.validPassword = async function (inputPassword) {
      return await bcrypt.compare(inputPassword, this.password);
   };

   return User;
};

export { UserModel };
