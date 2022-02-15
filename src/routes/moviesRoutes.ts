import { Router } from "express";
import {
  getAddMoviePage,
  getEditMoviePage,
  getMovieDetailPage,
  getMoviesPage,
} from "../controllers/pageController";
import {
  addMovie,
  deleteMovie,
  editMovie,
  likeMovie,
  reviewMovie,
} from "../controllers/profileController";
import { auth, authorization } from "../middlewares/authMiddleware";
import { validateMovie } from "../validation/postValidation";

const router = Router();

router.get("/", auth, authorization, getMoviesPage);

router.get("/add", auth, authorization, getAddMoviePage);

router.post("/add", auth, authorization, validateMovie, addMovie);

router.post("/edit/:id", auth, authorization, validateMovie, editMovie);

router.get("/edit/:id", auth, authorization, getEditMoviePage);

router.post("/review", auth, authorization, reviewMovie);

router.post("/like", auth, authorization, likeMovie);

router.post("/delete", auth, authorization, deleteMovie);

router.get("/:id", auth, authorization, getMovieDetailPage);

export default router;
