import 'dotenv/config';
import { connectDB } from './db/connectDB.js';
import express from 'express';
import Routes from './route.js';

const app = express();

const port = process.env.PORT;

(async () => {
   try {
      // connect to the database.
      await connectDB();

      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(express.static('public'));
      app.use('/', Routes);

      // Listen server on the port once database is connected successfully
      app.listen(port, () => {
         console.log(`server is listening on the port : ${port}`);
      });
   } catch (error) {
      console.log(`Error connectint to database : ${error}`);
   }
})();

export { app };
