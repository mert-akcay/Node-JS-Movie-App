import { check } from "express-validator";

export const validateStar = [
  check("firstName", "First Name must be at least 3 chars long")
    .trim()
    .isLength({ min: 3 }),

  check("lastName", "Last Name must be at least 3 chars long")
    .trim()
    .isLength({ min: 3 }),

  check("photoLink", "Photo link is not valid")
    .trim()
    .isURL()
    .optional({ nullable: true, checkFalsy: true }),
];

export const validateMovie = [
  check("title", "Title must be at least 3 chars long")
    .trim()
    .isLength({ min: 3 }),

  check("description", "Movie description must be at least 10 chars long")
    .trim()
    .isLength({ min: 10 }),

  check("photoLink", "Photo link is not valid")
    .trim()
    .isURL()
    .optional({ nullable: true, checkFalsy: true }),
];
