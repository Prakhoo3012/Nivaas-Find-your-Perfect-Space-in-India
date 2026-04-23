import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`, {
            dbName: DB_NAME,
        });
        // console.log(connectionInstance);
        
        console.log(`\n MongoDB Conected !! DB Host: ${connectionInstance.connection.host}`);        
        console.log(`MongoDB Conected !! DB: ${connectionInstance.connection.name}`);        
    } catch (error) {
        console.log('MONGODB CONNECTION FAILED !!!', error);
        process.exit(1);
        
    }
}

export default connectDB