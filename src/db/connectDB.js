import { sequelize } from '../models/index.js';

const connectDB = async () => {
   try {
      await sequelize.authenticate();
      console.log('Database Connection has been established successfully.');
      await sequelize.sync({ alter : true });
   } catch (error) {
      console.error('Unable to connect to the database:', error);
   }
};

export { connectDB };
