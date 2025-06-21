import 'dotenv/config';
import { connectDB } from './db/connectDB.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import Routes from './routes/users.routes.js';
import cors from 'cors';

const app = express();

const port = process.env.PORT || 3000;

(async () => {
   try {
      // connect to the database.
      await connectDB();

      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(express.static('.'));
      app.use(cookieParser());
      app.use(
         cors({
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true, // Allow cookies to be sent with requests
         })
      );

      app.use('/', Routes);

      // Listen server on the port once database is connected successfully
      app.listen(port, () => {
         console.log(`server is listening on the port : ${port}`);
      });
   } catch (error) {
      console.log(`Error connecting to database : ${error}`);
   }
})();

export { app };
