import { RequestHandler } from "express";
import { compare, hash } from "bcryptjs";
import { validationResult } from "express-validator";
import { sign } from "jsonwebtoken";
import { User } from "../model/entity/User";
import errorsHandle from "../config/errors";

//Register Controller
export const register: RequestHandler = async (req, res) => {
  //Deconstruct request body
  const { userName, firstName, lastName, email, password } = req.body;

  //If there are any errors from validation, redirect to the sign-up page
  if (errorsHandle(req)) return res.redirect("/sign-up");

  //Check if the user already exists, if so, send errors with flash
  const existingMail = await User.findOne({ email });
  const existingUserName = await User.findOne({ userName });
  if (existingUserName || existingMail) {
    req.flash("errors", ["Email or username is already signed up"]);
    return res.redirect("/sign-up");
  }

  //Hash password
  const hashedPass = await hash(password, 10);

  //Create a new user with hashed password
  const user = User.create({
    userName,
    firstName,
    lastName,
    email,
    password: hashedPass,
  });

  await User.save(user);

  //Redirect user to the sign-in page
  res.redirect(303, "/sign-in");
};

//Login Controller
export const login: RequestHandler = async (req, res) => {
  //Deconstruct request body
  const { userName, password } = req.body;

  //If there are any errors from validation, redirect to the sign-in page
  if (errorsHandle(req)) return res.redirect("/sign-in");

  //Check if user exists
  const user = await User.findOne({ userName });
  if (!user) {
    req.flash("errors", "User not found!");

    return res.redirect("/sign-in");
  }

  //Check if password is correct
  const passValid = await compare(password, user.password);
  if (!passValid) {
    req.flash("errors", "Password is not correct");
    return res.redirect("/sign-in");
  }

  //Issue a JWT token
  const token = sign({ id: user.id }, process.env.JWT_SECRET);
  res.cookie("jwt", token);

  //Load user to the req.user
  req.logIn(user, (err) => {});
  //Redirect signed user to homepage
  res.redirect("/");
};

//Facebook and Google Issue JWT Controller
export const issueJWT: RequestHandler = (req, res) => {
  //Create a JWT Token
  const token = sign({ id: req.user["id"] }, process.env.JWT_SECRET);

  //Send token with cookie
  res.cookie("jwt", token);

  //Redirect user to the homepage
  res.redirect("/");
};

//Sign-out Controller
export const signOut: RequestHandler = (req, res) => {
  //Clear jwt token for signing out
  res.clearCookie("jwt");

  //Log out
  req.logOut();

  //Redirect the user to homepage
  res.redirect("/");
};
