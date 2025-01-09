import { CorsOptions } from 'cors';
import express, { Request, Response } from "express";
import  dotenv  from 'dotenv';
import cors  from 'cors';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser  from "cookie-parser";
import { appConfig } from './config/appConfig';
import {authRouter, healthRouter, suiteRouter} from "./routes"
import { initializeSchemas } from './db/index';
import {setupSwagger} from './api-swagger-docs/swagger.setup'
import fs from 'fs';
import path from 'path';
dotenv.config();

const uploadDir = path.join(__dirname, 'artifacts');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const app = express();
const PORT =appConfig.host_port;
const allowedOrigins = ['localhost',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://rixoscomfort.netlify.app',
  'http://localhost:8081'];

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

const SERVICE_VERSION =`/api/${appConfig.api_version}`
app.get(SERVICE_VERSION, (_: Request, res: Response) =>{ res.status(200).send({message:"Crestview core service"});});

app.use(`${SERVICE_VERSION}/auth`, authRouter);
app.use(`${SERVICE_VERSION}`, suiteRouter);
app.use(SERVICE_VERSION,healthRouter);
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

app.get(`${SERVICE_VERSION}/test`, (_req:Request, res:Response) => {
  res.send('Swagger setup is working!');
});
// Start server with database connection
const startServer = async () => {
  await DBconnect();
  app.listen(PORT, (err?: Error) => {
    if (err) {
      console.error("Server connection error:", err);
      return;
    }
    console.log(`Server running on port ${PORT}`);
    setupSwagger(app);
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