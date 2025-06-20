import { DataTypes } from "sequelize";
import { User } from "./index.js"; // Import User model to establish foreign key relationship

const SpamModel = (sequelize) => {
   const Spam = sequelize.define(
      "Spam",
      {
         id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
         },
         userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "Users",
               key: "id",
            },
         },
         spamNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
               len: {
                  args: [10, 10],
                  msg: "Phone number should be exactly 10 digits",
               },
               isNumeric: {
                  msg: "Phone number should only contain digits",
               },
            },
         },
      },
      {
         sequelize, // pass the sequelize instance
         modelName: "Spam", // pass the model name
      }
   );

   return Spam;
}

export { SpamModel };