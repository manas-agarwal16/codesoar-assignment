import { User } from '../models/index.js';

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
         console.log(`Error searching user with phone number : ${error}`);
      }
   },

   registerUser: async (name, phoneNumber, email, password, verificationCode) => {
      try {

         const user = await User.create({
            fullName : name,
            phoneNumber,
            email,
            password,
            verificationCode,
            isVerified : false, // Initially set to false
         });

         return user;
      } catch (error) {
         console.log(`Error in registering user ${error}`);
         return error;
      }
   },

   verifyRegisteredUser: async (phoneNumber, verificationCode) => {
      try {
         
         const user = await User.findOne({
            where: {
               phoneNumber,
               verificationCode,
            },
         });

         if (!user) {
            throw new Error('Invalid phone number or verification code');
         }

         user.isVerified = true; // Set isVerified to true
         user.verificationCode = null; // Clear the verification code
         await user.save();

         return user;

      } catch (error) {
         console.error(`Error verifying user ${error}`); 
         return error;
      }
   },

   loginUser : async (phoneNumber, password) => {
      try {
         const user = await User.findOne({
            where: {
               phoneNumber,
            },
         });

         if (!user) {
            throw new Error('User not found');
         }

         const isPasswordValid = await user.validPassword(password);
         if (!isPasswordValid) {
            throw new Error('Invalid password');
         }

         return user;
      } catch (error) {
         console.error(`Error logging in user ${error}`);
         return error;
      }
   },

};

export default db;