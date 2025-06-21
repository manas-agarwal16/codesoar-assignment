import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import db from '../db/userDB.js';
import { User } from '../models/index.js';
import { ApiError } from '../utils/apiError.js';
import {
   generateAccessToken,
   generateRefreshToken,
} from '../utils/tokenGenerator.js';

// Function to register a new user
const register = asyncHandler(async (req, res) => {
   try {

      // take user details from request body
      const { name, phoneNumber, email, password } = req.body;
      
      // check if phone number is already registered
      const userPhoneExists = await db.checkUserPhoneExists(phoneNumber);

      // if phone number already exists, return error
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

      // Return success response
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
      return res.status(500).json(new ApiError(500, 'Internal Server Error'));
   }
});

// Function to login user
const login = asyncHandler(async (req, res) => {
   try {

      // extract phone number and password from request body
      const { phoneNumber, password } = req.body

      // check if phone number is registered and also verify password
      const user = await db.verifyPassword(phoneNumber, password);


      // if user is not found or password is incorrect, return error
      if (!user) {
         return res.status(401).json(new ApiError(401, 'Incorrect Password or phone number not registered yet'));
      }

      // generate access and refresh tokens
      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);

      // update the user's refresh token in the database
      await User.update({ refreshToken }, { where: { id: user.id } });

      const options = {
         sameSite: 'None',
         httpOnly: true,
         secure: true,
         maxAge: 24 * 60 * 1000, //1d
      };

      // return success response with access and refresh tokens in cookies
      return res
         .status(200)
         .cookie('accessToken', accessToken, options)
         .cookie('refreshToken', refreshToken, options)
         .json(
            new ApiResponse(
               201,
               {},
               'user logged in successfully'
            )
         );
   } catch (error) {
      console.error(`Error logging in user ${error}`);
      return res.status(500).json(new ApiError(500, 'Internal Server Error'));
   }
});

// Function to report a spam number
const reportSpam = asyncHandler(async (req, res) => {
   try {

      // extract phone number from request body and user id from req.user
      const { phoneNumber } = req.body;
      const userId = req.user.id;
   
      // check if user has already reported this number as spam
      const isSpamReported = await db.isReportedSpam(userId, phoneNumber);
   
      // return error if user had reported this number as spam before
      if( isSpamReported) {
         return res.status(409).json(new ApiError(409, 'You have already reported this number as spam'));
      }
   
      // mark the number as spam in the database
      await db.reportSpam(userId, phoneNumber);
   
      // return success response
      return res.status(200).json(new ApiResponse(200, [], 'Spam reported successfully'));
   } catch (error) {
      console.error(`Error reporting spam ${error}`);
      return res.status(500).json(new ApiError(500, 'Internal Server Error'));
   }
});

// Function to search users by name
const searchByName = asyncHandler(async (req , res) => {
   try {
      // extract name from query parameters and user id from req.user
      const {name} = req.query;
      const {id , phoneNumber} = req.user;      
   
      // search by name in the database, first users starting with the given name and then users containing the given name
      const users = await db.searchByName(name, id);
   
      // if no users found, return error
      if (!users || users.length === 0) {
         return res.status(404).json(new ApiError(404, 'No users found'));
      }
      
      // return success response with the found users
      return res.status(200).json(new ApiResponse(200, users, 'Users found successfully'));
   } catch (error) {
      console.error(`Error searching users by name ${error}`);
      return res.status(500).json(new ApiError(500, 'Internal Server Error'));
   }
});

// Function to search users by phone number
const searchByNumber = asyncHandler(async (req, res) => {
   try {

      // extract phone number from query parameters and user phone number from req.user
      const { phoneNumber } = req.query;
      const searchingUserPhoneNumber = req.user.phoneNumber;

      // search for users by phone number in the database
      const users = await db.searchByNumber(phoneNumber, searchingUserPhoneNumber);

      // if no users found, return error
      if (!users || users.length === 0) {
         return res.status(404).json(new ApiError(404, 'User not found with this phone number'));
      }

      // return success response with the found users
      return res.status(200).json(new ApiResponse(200, users, 'Users found successfully with the given phone number'));
   } catch (error) {
      console.error(`Error searching user by number ${error}`);
      return res.status(500).json(new ApiError(500, 'Internal Server Error'));
   }
});

export { register, login, reportSpam, searchByName, searchByNumber };
