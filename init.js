// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require("dotenv");

const Admin = require("./src/routers/Admin");
const users = require("./src/routers/users");
const query = require("./src/routers/query");
const authService = require("./src/routers/auth/socialAuth");
const tokenizedAuthService = require("./src/routers/auth/tokenizedAuth");
const health=require("./src/routers/health")
const { AuthSession } = require("./src/middleware/auth");
const { appConfig } = require("./src/config/appConfig");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;
const allowedOrigins = ['http://localhost:3000', 'https://rixoscomfort.netlify.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(AuthSession);

// Routes
app.use(health);
app.get('/',  (_, res) =>res.status(200).json("CrestView Api service"));
app.use("/admin", Admin);
app.use("/user", users);
app.use("/session", query);
app.use("/api/auth", authService);
app.use("/api/auth", tokenizedAuthService);

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


const startServer = async () => {
  await DBconnect();
  app.listen(PORT, (err) => {
    if (err) {
      console.error("server connection error:", err);
      return;
    }
    console.log(`server running on port ${PORT}`);
  });
};

startServer();

// Serve static files
app.use(express.static("client/build"));

if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
