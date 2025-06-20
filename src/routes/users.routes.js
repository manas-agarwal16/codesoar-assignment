import express from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
const router = express.Router();

import { emptyDb, login, register, reportSpam, searchByName, searchByNumber } from "../controllers/users.controllers.js";

router.delete('/emptydb', emptyDb);

router.post('/register' , register);
router.post('/login', login);
router.post('/report-spam', verifyJWT, reportSpam);
router.get('/search-by-name', verifyJWT, searchByName);
router.get('/search-by-number', verifyJWT, searchByNumber);


export default router;