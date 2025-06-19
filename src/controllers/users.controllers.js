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

const register = asyncHandler(async (req, res) => {
   try {
      const { name, phoneNumber, email, password } = req.body;
      console.log('name', name);
      console.log('phoneNumber', phoneNumber);

      const userPhoneExists = await db.checkUserPhoneExists(phoneNumber);

      if (userPhoneExists) {
         return res
            .status(409)
            .json(new ApiError(409, 'Phone number already exists'));
      }

      const verificationCode = verificationCodeGenerator();

      // send verification code to user's phone number via SMS
      console.log('dfvvvdjvdf');

      await sendSMS(
         phoneNumber,
         `Your verification code is: ${verificationCode}`
      );

      // Register the user in the database , but do not set isVerified to true yet
      await db.registerUser(
         name,
         phoneNumber,
         email,
         password,
         verificationCode
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

const login = asyncHandler(async (req, res) => {
   try {
      const { phoneNumber, password } = req.body;

      const user = await db.loginUser(phoneNumber, password);
      if (!user) {
         return new ApiError(401, 'Invalid phone number or password');
      }

      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);

      console.log(`Access Token: ${accessToken}`);
      console.log(`Refresh Token: ${refreshToken}`);

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

export { register, login, emptyDb };
