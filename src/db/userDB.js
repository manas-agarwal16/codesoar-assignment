import { Spam, User, Contact } from '../models/index.js';
import { Op } from 'sequelize';

const db = {
   checkUserPhoneExists: async (phoneNumber) => {
      try {
         const user = await User.findOne({
            where: {
               phoneNumber,
            },
         });
         return user;
      } catch (error) {
         console.error(`Error searching user with phone number : ${error}`);
         return error;
      }
   },

   registerUser: async (name, phoneNumber, email, password) => {
      try {
         const user = await User.create({
            name: name,
            phoneNumber,
            email,
            password,
         });

         return user;
      } catch (error) {
         console.error(`Error in registering user ${error}`);
         return error;
      }
   },

   verifyPassword: async (phoneNumber, password) => {
      try {
         const user = await User.findOne({
            where: {
               phoneNumber,
            },
         });

         if (!user) {
            return null;
         }

         const isPasswordValid = await user.validPassword(password);
         if (!isPasswordValid) {
            return null;
         }

         return user;
      } catch (error) {
         console.error(`Error logging in user ${error}`);
         return error;
      }
   },

   isReportedSpam: async (userId, phoneNumber) => {
      try {
         const spam = await Spam.count({
            where: {
               userId,
               spamNumber: phoneNumber,
            },
         });
         return spam > 0;
      } catch (error) {
         console.error(`Error checking spam report ${error}`);
         return error;
      }
   },

   reportSpam: async (userId, phoneNumber) => {
      try {
         await Spam.create({
            userId,
            spamNumber: phoneNumber,
         });
         return true;
      } catch (error) {
         console.error(`Error reporting spam ${error}`);
         return error;
      }
   },

   searchByName: async (name, userId) => {
      try {
         // search registered users starting with the name
         const searchRegisteredUsersStartingWithName = await User.findAll({
            where: {
               name: {
                  [Op.iLike]: `${name}%`,
               },
            },
            attributes: ['id', 'name', 'phoneNumber'],
         });

         // search registered users containing the name and excluding already found users
         const searchRegisteredUsersContainingName = await User.findAll({
            where: {
               name: {
                  [Op.iLike]: `%${name}%`,
               },
               id: {
                  [Op.notIn]: searchRegisteredUsersStartingWithName.map(
                     (user) => user.id
                  ),
               },
            },
            attributes: ['id', 'name', 'phoneNumber'],
         });

         // Combine both lists of registered users
         let usersList = [
            ...searchRegisteredUsersStartingWithName,
            ...searchRegisteredUsersContainingName,
         ];

         // count total registered users to calculate spam likelihood
         const totalRegisteredUsers = await User.count();

         // spam likelihood check
         usersList = await Promise.all(
            usersList.map(async (user) => {
               const spamCount = await Spam.count({
                  where: {
                     spamNumber: user.phoneNumber,
                  },
               });               

               // calculate spam likelihood using percentage formula
               user.dataValues.spamLikelihood = (((spamCount / totalRegisteredUsers) * 100).toFixed(2)).toString() + '%';

               return user;
            })
         );

         return usersList;
      } catch (error) {
         console.error(`Error searching users by name ${error}`);
         return error;
      }
   },

   searchByNumber: async (phoneNumber, searchingUserPhoneNumber) => {
      try {
         
         // check if any user with the phone number is registered
         const registeredUser = await User.findOne({
            where: {
               phoneNumber,
            },
            attributes: ['id', 'name', 'phoneNumber', 'email'],
         });

         // count total registered users to calculate spam likelihood
         const totalRegisteredUsers = await User.count();

         // calculate total spam count for the phone number
         const spamCount = await Spam.count({
            where: {
               spamNumber: phoneNumber,
            },
         });

         // calculate spam likelihood using percentage formula
         const spamLikelihood = (((spamCount / totalRegisteredUsers) * 100).toFixed(2)).toString() + '%';

         // if user is registered, check if the registered user has the searching user as contact
         if (registeredUser) {
            
            registeredUser.dataValues.spamLikelihood = spamLikelihood; // Add spam likelihood to the registered user

            const isContact = await Contact.findOne({
               where: {
                  userId: registeredUser.id,
                  contactNumber: searchingUserPhoneNumber,
               },
            });

            // If the registered user has the searching user as contact, then set the email
            if (isContact) {
               registeredUser.email = registeredUser.email;
            } else {
               registeredUser.email = null; // If not a contact, set email to null
            }

            return [registeredUser]; // Return as an array for consistency
         }

         // if user is not registered, check users with the phone number in contact db.
         const users = await Contact.findAll({
            where: {
               contactNumber : phoneNumber,
            },
         });

         // data format users details.
         const usersDetails = await Promise.all(
            users.map(async (user) => {
               return {
                  name : user.contactName,
                  phoneNumber,
                  email: null, // Only registered users have email
                  spamLikelihood, // Add spam likelihood to the contact user
               }
            })
         );

         // return users details with spam likelihood
         return usersDetails;
      } catch (error) {
         console.error(`Error searching users by number ${error}`);
         return error;
      }
   },
};

export default db;
