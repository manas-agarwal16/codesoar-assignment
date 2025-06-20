import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

const verifyJWT = asyncHandler(async (req, res, next) => {
   try {
      const token =
         req.cookies?.accessToken ||
         req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
         return res.status(401).json(new ApiError(401, 'Unauthorized Request'));
      }

      // Decode the token
      let decodedToken = await jwt.verify(
         token,
         process.env.ACCESSTOKEN_PRIVATE_KEY
      );

      if (!decodedToken) {
         return res
            .status(401)
            .json(new ApiError(401, 'Error decoding access token'));
      }

      decodedToken = decodedToken.data; // Extract user data from the token

      const user = await User.findOne({
         attributes: { exclude: ['password', 'refreshToken'] },
         where: {
            id: decodedToken.id,
         },
      });

      if (!user) {
         return res
            .status(401)
            .json(new ApiError(401, 'Unauthorized Request - user not found'));
      }

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
