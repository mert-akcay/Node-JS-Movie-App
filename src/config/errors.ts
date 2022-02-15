import { Request } from "express";
import { validationResult } from "express-validator";

const errorsHandle = (req: Request) => {
  //Define an errors array
  let errorsArr = [];

  //If there are errors, send them to the page with flash
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach((item) => {
      errorsArr.push(item.msg);
    });
    req.flash("errors", errorsArr);
    return true;
  } else {
    return false;
  }
};

export default errorsHandle;
