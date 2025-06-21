import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

const verifyJWT = asyncHandler(async (req, res, next) => {
   try {

      // Check for access token in cookies or Authorization header
      const token =
         req.cookies?.accessToken ||
         req.header('Authorization')?.replace('Bearer ', '');

      // If no token is found, return unauthorized error
      if (!token) {
         return res.status(401).json(new ApiError(401, 'Unauthorized Request'));
      }

      // Decode the token
      let decodedToken = await jwt.verify(
         token,
         process.env.ACCESSTOKEN_PRIVATE_KEY
      );

      // If token is not decoded successfully, return unauthorized error
      if (!decodedToken) {
         return res
            .status(401)
            .json(new ApiError(401, 'Unauthorized Request - invalid token'));
      }

      decodedToken = decodedToken.data; // Extract user data from the token

      // Find the user in the database using the ID from the decoded token
      const user = await User.findOne({
         attributes: { exclude: ['password', 'refreshToken'] },
         where: {
            id: decodedToken.id,
         },
      });

      // If user is not found, return unauthorized error
      if (!user) {
         return res
            .status(401)
            .json(new ApiError(401, 'Unauthorized Request - user not found'));
      }

      // Attach the user to the request object for further use in the application
      req.user = user;
      next(); // Proceed to next middleware
   } catch (error) {
      if (error.name === 'TokenExpiredError') {
         return res
            .status(401)
            .json(new ApiError(401, 'Token expired. Please log in again.'));
      }

      return res.status(401).json(new ApiError(401, 'Unauthorized Request'));
   }
});

export { verifyJWT };
