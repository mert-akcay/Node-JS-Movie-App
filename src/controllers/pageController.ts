import { RequestHandler } from "express";
import { Like } from "typeorm";
import { Movie } from "../model/entity/Movie";
import { MovieLike } from "../model/entity/MovieLikes";
import { MovieReview } from "../model/entity/MovieReview";
import { Star } from "../model/entity/Star";
import { StarLikes } from "../model/entity/StarLikes";
import { StarReview } from "../model/entity/StarReview";

//Get Home Page Controller
export const getHomePage: RequestHandler = (req, res) => {
  //Render homepage
  res.render("home", { isAuth: req.isAuth });
};

//Get Register Page Controller
export const getRegisterPage: RequestHandler = (req, res) => {
  //Render sign-up page
  res.render("sign-up", {
    errors: req.flash("errors"),
    isAuth: req.isAuth,
  });
};

//Get Login Page Controller
export const getLoginPage: RequestHandler = (req, res) => {
  //Render sign-in page
  res.render("sign-in", {
    isAuth: req.isAuth,
    errors: req.flash("errors"),
  });
};

//Get Searching Page Controller
export const search: RequestHandler = async (req, res) => {
  const { search, searchtext } = req.body;

  if (search == "movies") {
    const movies = await Movie.findAndCount({
      where: { title: Like(`%${searchtext}%`), public: true },
      relations: ["user"],
    });
    const likes = await MovieLike.getLikedMovieByUser(req.user["id"]);
    res.render("searchmovie", {
      isAuth: req.isAuth,
      movies,
      user: req.user,
      likes,
    });
  } else if (search == "stars") {
    const stars = await Star.findAndCount({
      where: [
        { firstName: Like(`%${searchtext}%`), public: true },
        { lastName: Like(`%${searchtext}%`), public: true },
      ],
      relations: ["user"],
    });

    const likes = await StarLikes.getLikedStarByUser(req.user["id"]);

    res.render("searchstar", {
      isAuth: req.isAuth,
      user: req.user,
      stars,
      likes,
    });
  }
};

//Get Movie Adding Page Controller
export const getAddMoviePage: RequestHandler = (req, res) => {
  //Render addmovie, with given data
  res.render("addmovie", {
    isAuth: req.isAuth,
    user: req.user,
    errors: req.flash("errors"),
    success: req.flash("success"),
  });
};

//Get Edit Movie Page Controller
export const getEditMoviePage: RequestHandler = async (req, res) => {
  //Get movie id from request parameters
  const movieID = req.params.id;

  //Find movie and if it's not added by user, go movies page
  const movie = await Movie.findOne(movieID, { relations: ["user"] });
  if (!(movie.user.id == req.user["id"])) return res.redirect("/movies");

  //Render movie editing page
  res.render("editmovie", {
    isAuth: req.isAuth,
    user: req.user,
    errors: req.flash("errors"),
    success: req.flash("success"),
    movie,
  });
};

//Get Star Adding Page Controller
export const getAddStarPage: RequestHandler = (req, res) => {
  //Render addstar page with
  res.render("addstar", {
    isAuth: req.isAuth,
    errors: req.flash("errors"),
    success: req.flash("success"),
  });
};

//Get Edit Star Page Controller
export const getEditStarPage: RequestHandler = async (req, res) => {
  const starID = req.params.id;

  //Find movie and if it's not added by user, go movies page
  const star = await Star.findOne(starID, { relations: ["user"] });
  if (!(star.user.id == req.user["id"])) return res.redirect("/stars");

  res.render("editstar", {
    isAuth: req.isAuth,
    user: req.user,
    errors: req.flash("errors"),
    success: req.flash("success"),
    star,
  });
};

//Get All Shared Movies Page Controller
export const getMoviesPage: RequestHandler = async (req, res) => {
  //Get shared movies
  const movies = await Movie.getSharedMovies();
  const likes = await MovieLike.getLikedMovieByUser(req.user["id"]);

  //Render movielist
  res.render("movielist", {
    isAuth: req.isAuth,
    movies,
    user: req.user,
    likes,
  });
};

//Get All Shared Stars Page Controller
export const getStarsPage: RequestHandler = async (req, res) => {
  //Get all shared stars
  const stars = await Star.getSharedStars();

  //Get a list of user's liked stars
  const likes = await StarLikes.getLikedStarByUser(req.user["id"]);

  //Render the stars page
  res.render("stars", { isAuth: req.isAuth, stars, user: req.user, likes });
};

//Get Movie Detail Page Controller
export const getMovieDetailPage: RequestHandler = async (req, res) => {
  //Get movie id from request parameters
  const id = req.params.id;

  //Find movie and if it's not public, go movies page
  const movie = await Movie.findOne(id, { relations: ["user"] });
  if (!(movie.public || movie.user.id == req.user["id"]))
    return res.redirect("/movies");

  //Get movie's reviews
  const reviews = await MovieReview.getReviewsByMovie(id);

  //Check if the user liked this movie ır not
  const liked = await MovieLike.checkLiked(req.user, movie);

  //Get how much like did star get
  const likesCount = await MovieLike.getMovieLikesCount(id);

  //Render page
  res.render("moviesingle", {
    movie,
    isAuth: req.isAuth,
    reviews,
    liked,
    likesCount,
  });
};

//Get Star Detail Page Controller
export const getStarDetailPage: RequestHandler = async (req, res) => {
  //Get star ID from request parameter
  const { id } = req.params;

  //Find star by the ID and if it's not public redirect to stars page
  const star = await Star.findOne(id, { relations: ["user"] });
  if (!(star.public || star.user.id == req.user["id"]))
    return res.redirect("/stars");

  //Get star's reviews by id
  const reviews = await StarReview.getReviewsByStar(id);

  //Check if the user liked movie or not
  const liked = await StarLikes.checkLiked(req.user, star);

  //Get how much like did star get
  const likesCount = await StarLikes.getStarLikesCount(id);

  //Render the star detail page
  res.render("starsingle", {
    isAuth: req.isAuth,
    reviews,
    star,
    liked,
    likesCount,
  });
};
