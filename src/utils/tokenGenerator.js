import jwt from 'jsonwebtoken';

export const generateAccessToken = async (user) => {
   const accessTokenPrivateKey = process.env.ACCESSTOKEN_PRIVATE_KEY;

   const accessToken = await jwt.sign(
      {
         exp: Math.floor(Date.now() / 1000) + 60 * 60,
         data: {
            id: user.id,
            phoneNumber: user.phoneNumber,
         },
      },
      accessTokenPrivateKey
   );

   return accessToken;
};

export const generateRefreshToken = async (user) => {
   const refreshTokenPrivateKey = process.env.REFRESHTOKEN_PRIVATE_KEY;

   const refreshToken = await jwt.sign(
      {
         exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
         data: {
            id: user.id,
            phoneNumber: user.phoneNumber,
         },
      },
      refreshTokenPrivateKey
   );
   return refreshToken;
};