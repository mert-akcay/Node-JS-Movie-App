import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";

//This middleware is for determining the user is authenticated or not
export const auth: RequestHandler = (req, res, next) => {
  //Get JWT Token from cookie
  const token = req.cookies.jwt;

  //Set a default isAuth value in request
  req.isAuth = false;

  //If there is no token or logged in user, leave isAuth false and go next
  if (!token || !req.user) return next();

  //Verify token and if it's not equal to the given value, go next
  verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next();
    if (!(req.user["id"] == decoded.id)) return next();
  });

  //If everything is allright, set isAuth to true and go next
  req.isAuth = true;
  next();
};

//This middleware is for redirecting to user to the sign-in page if he/she's not authenticated
export const authorization: RequestHandler = (req, res, next) => {
  if (req.isAuth) {
    next();
  } else {
    return res.redirect("/sign-in");
  }
};
