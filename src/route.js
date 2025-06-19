import express from "express";
import { Router } from "express";
import userRoutes from "./routes/users.routes.js";

const router = Router();

router.use('/user', userRoutes);

router.get('/' , (req , res) => {
    res.send('hello');
});

export default router;