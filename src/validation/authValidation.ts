import { check } from "express-validator";

export const validateRegister = [
  check("email", "Invalid email").isEmail().trim(),

  check("userName", "Username must be at least 4 chars long").isLength({
    min: 4,
  }),

  check(
    "password",
    "Invalid password. Password must be at least 4 chars long"
  ).isLength({ min: 4 }),

  check("rePassword", "Repassword does not match password").custom(
    (value, { req }) => {
      return value === req.body.password;
    }
  ),
];

export const validateLogin = [
  check("userName", "Username is not valid").trim().isLength({ min: 4 }),
  check("password", "Password is not valid").isLength({ min: 4 }),
];

export const validateEdit = [
  check("firstName", "First name munotst be at least 4 chars long")
    .trim()
    .isLength({ min: 4 }),
  check("lastName", "Last name must be at least 4 chars long")
    .trim()
    .isLength({ min: 4 }),
];
