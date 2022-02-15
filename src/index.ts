import * as path from "path";
import { config } from "dotenv";
import express from "express";
import passport from "passport";
var flash = require("connect-flash");
import session from "express-session";
import cookieParser from "cookie-parser";
import { connection } from "./config/connection";
import router from "./routes/baseRoutes";

//Initialise express
const app = express();

//Dotenv
config();

//Database connection
connection();

//Express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "./src/views"));
app.use(express.static("public"));
app.use(cookieParser());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//Routes
app.use("/", router);

//Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
