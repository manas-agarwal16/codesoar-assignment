import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import db from '../db/userDB.js';
import { User } from '../models/index.js';
import { ApiError } from '../utils/apiError.js';
import { sendSMS } from '../utils/sendSMS.js';
import { verificationCodeGenerator } from '../utils/verificationCodeGenerator.js';
import {
   generateAccessToken,
   generateRefreshToken,
} from '../utils/tokenGenerator.js';

const emptyDb = asyncHandler(async (req, res) => {
   try {
      // Clear the database
      await User.destroy({
         where: {},
         cascade: true,
      });

      return res.status(200).json(new ApiResponse(200, [], 'Database cleared'));
   } catch (error) {
      console.error(`Error clearing database: ${error}`);
      return res.status(500).json(new ApiError(500, 'Internal Server Error'));
   }
});

// Function to register a new user
const register = asyncHandler(async (req, res) => {
   try {
      const { name, phoneNumber, email, password } = req.body;
      
      const userPhoneExists = await db.checkUserPhoneExists(phoneNumber);

      if (userPhoneExists) {
         return res
            .status(409)
            .json(new ApiError(409, 'Phone number already exists'));
      }

      // Register the user in the database
      await db.registerUser(
         name,
         phoneNumber,
         email,
         password,
      );

      return res
         .status(201)
         .json(
            new ApiResponse(
               201,
               [],
               'User registered successfully. Please verify your phone number.'
            )
         );
   } catch (error) {
      console.error(`Error registering user ${error}`);
   }
});

// Function to login user
const login = asyncHandler(async (req, res) => {
   try {
      const { phoneNumber, password } = req.body;

      const user = await db.verifyPassword(phoneNumber, password);
      if (!user) {
         return new ApiError(401, 'Invalid phone number or password');
      }

      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);

      console.log(`Access Token: ${accessToken}`);
      console.log(`Refresh Token: ${refreshToken}`);

      await User.update({ refreshToken }, { where: { id: user.id } });

      const options = {
         sameSite: 'None',
         httpOnly: true,
         secure: true,
         maxAge: 24 * 60 * 1000, //1d
      };

      return res
         .status(200)
         .cookie('accessToken', accessToken, options)
         .cookie('refreshToken', refreshToken, options)
         .json(
            new ApiResponse(
               201,
               { loginStatus: true, playerData: player },
               'Logged in successfully'
            )
         );
   } catch (error) {}
});

// Function to report a spam number
const reportSpam = asyncHandler(async (req, res) => {
   const { phoneNumber } = req.body;
   const userId = req.user.id;

   // check if user had reported this number as spam before
   const isSpamReported = await db.isReportedSpam(userId, phoneNumber);

   // return error if user had reported this number as spam before
   if( isSpamReported) {
      return res.status(409).json(new ApiError(409, 'You have already reported this number as spam'));
   }

   // mark the number as spam in the database
   await db.reportSpam(userId, phoneNumber);

   // return success response
   return res.status(200).json(new ApiResponse(200, [], 'Spam reported successfully'));
});

// Function to search users by name
const searchByName = asyncHandler(async (req , res) => {
   try {
      const {name} = req.query;
      const {id , phoneNumber} = req.user;
   
      const users = await db.searchByName(name, id);
   
      if (!users || users.length === 0) {
         return res.status(404).json(new ApiError(404, 'No users found'));
      }
      
      return res.status(200).json(new ApiResponse(200, users, 'Users found successfully'));
   } catch (error) {
      console.error(`Error searching users by name ${error}`);
      return res.status(500).json(new ApiError(500, 'Internal Server Error'));
   }
});

// Function to search users by phone number
const searchByNumber = asyncHandler(async (req, res) => {
   try {
      const { phoneNumber } = req.query;
      const searchingUserPhoneNumber = req.user.phoneNumber;

      const users = await db.searchByNumber(phoneNumber, searchingUserPhoneNumber);

      if (!users || users.length === 0) {
         return res.status(404).json(new ApiError(404, 'User not found with this phone number'));
      }

      return res.status(200).json(new ApiResponse(200, users, 'Users found successfully with the given phone number'));
   } catch (error) {
      console.error(`Error searching user by number ${error}`);
      return res.status(500).json(new ApiError(500, 'Internal Server Error'));
   }
});

export { register, login, emptyDb, reportSpam, searchByName, searchByNumber };
