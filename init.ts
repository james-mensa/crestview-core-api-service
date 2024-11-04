// server.js
import { CorsOptions } from 'cors';
import express, { Request, Response } from "express";
import  dotenv  from 'dotenv';
import cors  from 'cors';
import { AdminModel } from "./src/db";
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const dotenv = require("dotenv");


const authService = require("./src/routers/auth/socialAuth");
const tokenizedAuthService = require("./src/routers/auth/tokenizedAuth");
const health=require("./src/routers/health")
const { AuthSession } = require("./src/middleware/auth");
const { appConfig } = require("./src/config/appConfig");

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3003;
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
app.use(AuthSession);

// Routes
app.use(health);
app.get('/', (_: Request, res: Response) =>{ res.status(200).send({message:"Crestview core service"});});
app.use("/admin", AdminModel);
// app.use("/user", users);
// app.use("/session", query);
// app.use("/api/auth", authService);
// app.use("/api/auth", tokenizedAuthService);

// Database Connection
const DBconnect = async () => {
  try {
    await mongoose.connect(appConfig.baseMongoDBURL);
    console.log('MongoDB connected');
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