import { Router } from "express";
import { getUserMovies, getUserStars, profileEdit, shareMovie, shareStar, userProfile } from "../controllers/profileController";
import { auth, authorization } from "../middlewares/authMiddleware";
import { validateEdit } from "../validation/authValidation";

const router = Router();

router.get("/", auth, authorization, userProfile);

router.post("/edit", validateEdit, profileEdit);

router.get("/movies", auth, authorization, getUserMovies);

router.get("/stars", auth, authorization, getUserStars);

router.post("/movie/share", auth, authorization, shareMovie);

router.post("/star/share", auth, authorization, shareStar);
export default router;