import express from 'express';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import validateRequestParams from '../utils/validateRequestParams.js';
import validationRules from '../utils/validationRules.js';
const router = express.Router();

import {
   login,
   register,
   reportSpam,
   searchByName,
   searchByNumber,
} from '../controllers/users.controllers.js';

// route to get the welcome message
router.get('/', (req, res) => {
   res.status(200).json({
      message:
         'Hello CodeSoar Technology! This backend service is implemented by Manas Agarwal as part of the assignment. It demonstrates user registration, login, spam reporting, and search features.',
   });
});

// route to register a user
router.post(
   '/register',
   validateRequestParams(validationRules.register),
   register
);
// route to login a user
router.post('/login', validateRequestParams(validationRules.login), login);

// route to report a spam number
router.post(
   '/report-spam',
   validateRequestParams(validationRules.reportSpam),
   verifyJWT,
   reportSpam
);

// route to search users by name
router.get(
   '/search-by-name',
   validateRequestParams(validationRules.searchByName),
   verifyJWT,
   searchByName
);

// route to search users by phone number
router.get(
   '/search-by-number',
   validateRequestParams(validationRules.searchByNumber),
   verifyJWT,
   searchByNumber
);

export default router;
