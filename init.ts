import { CorsOptions } from 'cors';
import express, { Request, Response } from "express";
import  dotenv  from 'dotenv';
import cors  from 'cors';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser  from "cookie-parser";
import { appConfig } from './src/config/appConfig';
import {authRouter, healthRouter, suiteRouter} from "./src/routes"
import { initializeSchemas } from './src/db/index';
import fs from 'fs';
import path from 'path';
dotenv.config();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const app = express();
const PORT = process.env.PORT || 3004;
const allowedOrigins = ['http://localhost:3000', 'https://rixoscomfort.netlify.app'];

// CORS configuration with callback
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/api', (_: Request, res: Response) =>{ res.status(200).send({message:"Crestview core service"});});

app.use("/api/auth", authRouter);
app.use("/api/suite", suiteRouter);
app.use(healthRouter);
// app.use("/session", query);
// app.use("/api/auth", authService);
// app.use("/api/auth", tokenizedAuthService);

// Database Connection
const DBconnect = async () => {
  try {
    await mongoose.connect(appConfig.baseMongoDBURL??'');
    console.log('MongoDB connected');
    initializeSchemas();
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Start server with database connection
const startServer = async () => {
  await DBconnect();
  app.listen(PORT, (err?: Error) => {
    if (err) {
      console.error("Server connection error:", err);
      return;
    }
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

// // Serve static files in production
// app.use(express.static("client/build"));

// if (process.env.NODE_ENV === "production") {
//   const path = require("path");
//   app.get("*", (req: Request, res: Response) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }