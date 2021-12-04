import dotenv from "dotenv";

import express from "express";
// import http from "http";
// import { Server } from "socket.io";

import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./config/db.js";

import authRouter from "./routes/auth.js";
import savedRouter from "./routes/saved.js";

import cors from "cors";
import bodyParser from "body-parser";

// Dotenv config
dotenv.config({ path: "./config/config.env" });

// Passport config
import { GooglePassport } from "./config/passport.js";
GooglePassport(passport);

// MongoDB config
connectDB();

const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
// io.on("connection", (socket) => {
//   console.log("a user connected????");
//   socket.on("message", (message) => {
//     console.log(message);
//     io.emit("message", message);
//   });
//   // socket.on("disconnect", () => {
//   //   console.log("user disconnected");
//   // });
// });

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
process.env.NODE_ENV === "development" && app.use(morgan("dev"));

// Session setup
app.use(
  session({
    key: "userId",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRouter);
app.use("/saved", savedRouter);

// Listen on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
