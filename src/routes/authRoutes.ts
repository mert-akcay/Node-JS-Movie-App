import { Router } from "express";
import passport from "passport";
import passportConfig from "../config/passport";
import { issueJWT } from "../controllers/authController";

const router = Router();

//Apply passport config to the passport object
passportConfig();

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: "email", session: false })
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: true,
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/sign-in",
    session: true,
  }),
  issueJWT
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/sign-in",
    session: true,
  }),
  issueJWT
);

export default router;
