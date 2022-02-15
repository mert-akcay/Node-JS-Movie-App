import { Router } from "express";
import starsRouter from "./starsRoutes";
import moviesRouter from "./moviesRoutes";
import profileRouter from "./profileRoutes";
import authRouter from "./authRoutes";
import { login, register, signOut } from "../controllers/authController";
import {
  getHomePage,
  getLoginPage,
  getRegisterPage,
  search,
} from "../controllers/pageController";
import { auth, authorization } from "../middlewares/authMiddleware";
import { validateLogin, validateRegister } from "../validation/authValidation";


//Initialise router
const router = Router();

// STARS
router.use("/stars", starsRouter);

// MOVIES
router.use("/movies", moviesRouter);

// PROFILE
router.use("/profile", profileRouter);

// AUTH
router.use("/auth", authRouter);

//BASE ROOTS
router.get("/", auth, getHomePage);

router.get("/sign-up", auth, getRegisterPage);

router.get("/sign-in", auth, getLoginPage);

router.post("/sign-up", validateRegister, register);

router.post("/sign-in", validateLogin, login);

router.get("/sign-out", auth, signOut);

router.post("/search", auth, authorization, search);

export default router;
