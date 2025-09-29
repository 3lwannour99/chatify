import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import {connectDB} from "./lib/db.js";

const app = express();
const __dirname = path.resolve();

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json())// req.body
app.use(cookieParser());
//prefix
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  // if u visit any route exept the our routes , the frontend will appear
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(
  PORT,
  () => {
    console.log(`server is run on port ${PORT}`);
    connectDB()
  },
  
);
