import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectToMongoDbDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("connected to database successfully !");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};

export default connectToMongoDbDatabase;
