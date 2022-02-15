import { Router } from "express";
import {
  getAddStarPage,
  getEditStarPage,
  getStarDetailPage,
  getStarsPage,
} from "../controllers/pageController";
import {
  addStar,
  deleteStar,
  editStar,
  likeStar,
  reviewStar,
} from "../controllers/profileController";
import { auth, authorization } from "../middlewares/authMiddleware";
import { validateStar } from "../validation/postValidation";

const router = Router();

router.get("/", auth, authorization, getStarsPage);

router.get("/add", auth, authorization, getAddStarPage);

router.post("/add", auth, authorization, validateStar, addStar);

router.post("/edit/:id", auth, authorization, validateStar, editStar);

router.get("/edit/:id", auth, authorization, getEditStarPage);

router.post("/review", auth, authorization, reviewStar);

router.post("/like", auth, authorization, likeStar);

router.post("/delete", auth, authorization, deleteStar);

router.get("/:id", auth, authorization, getStarDetailPage);

export default router;
