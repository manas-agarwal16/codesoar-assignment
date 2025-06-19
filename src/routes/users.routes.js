import express from "express";
const router = express.Router();

import { emptyDb, login, register } from "../controllers/users.controllers.js";

router.delete('/emptydb', emptyDb);

router.post('/register' , register);


export default router;