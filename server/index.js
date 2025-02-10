import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/auth.js";
import noteRouter from "./routes/note.js";
import connectToMongoDbDatabase from "./db/db.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
dotenv.config();
app.use(cors());

app.use("/api/auth", router);
app.use("/api/note", noteRouter);
app.listen(process.env.PORT, () => {
  connectToMongoDbDatabase();
  console.log(`app running on ${process.env.PORT}`);
});
