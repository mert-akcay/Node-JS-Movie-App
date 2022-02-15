import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { User } from "../model/entity/User";
import { Movie } from "../model/entity/Movie";
import { MovieLike } from "../model/entity/MovieLikes";
import { MovieReview } from "../model/entity/MovieReview";
import { Star } from "../model/entity/Star";
import { StarLikes } from "../model/entity/StarLikes";
import { StarReview } from "../model/entity/StarReview";

//User Profile Controller
export const userProfile: RequestHandler = async (req, res) => {
  //Render User's profile page
  res.render("userprofile", {
    isAuth: req.isAuth,
    user: req.user,
    errors: req.flash("errors"),
    success: req.flash("success"),
    index: 0,
  });
};

//Profile Editing Controller
export const profileEdit: RequestHandler = async (req, res) => {
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
    return res.redirect("/profile");
  }

  //Desconstruct th request body
  const { userName, firstName, lastName, email } = req.body;

  const user = await User.findOne({ id: req.user["id"] });
  user.firstName = firstName;
  user.lastName = lastName;
  if (userName) user.userName = userName;
  if (email) user.email = email;

  const existingUser = await User.findOne({ userName });
  if (existingUser) {
    req.flash("errors", ["User already exists. Choose a different username"]);
    return res.redirect("/profile");
  }

  User.save(user);
  req.flash("success", "User updated succesfully");
  res.redirect("/profile");
};

//User Movies Controller
export const getUserMovies: RequestHandler = async (req, res) => {
  //Find user
  const user = await User.findOne({ id: req.user["id"] });

  //Get user's movies
  const movies = await Movie.getMoviesByUser(req.user["id"]);

  //Render page with info
  res.render("usermovies", {
    isAuth: req.isAuth,
    user,
    errors: req.flash("errors"),
    success: req.flash("success"),
    movies,
    index: 1,
  });
};

//User Stars Controller
export const getUserStars: RequestHandler = async (req, res) => {
  //Find user
  const user = await User.findOne({ id: req.user["id"] });

  //Get user's stars
  const stars = await Star.getStarsByUser(req.user["id"]);

  //Render the user stars page
  res.render("userstars", {
    isAuth: req.isAuth,
    user,
    errors: req.flash("errors"),
    success: req.flash("success"),
    stars,
    index: 2,
  });
};

//Add Movie Controller
export const addMovie: RequestHandler = async (req, res) => {
  //Deconstruct the request body
  const { title, description, actors, photoLink } = req.body;

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
    return res.redirect("/movies/add");
  }

  //Create a new movie according to request body
  const movie = Movie.create({
    title,
    description,
    actors,
    photo: photoLink,
    user: req.user,
  });

  //Save this new movie
  Movie.save(movie);

  //Send success message with flash
  req.flash("success", "Movie succesfully added.");

  //Redirect user to add movie page
  res.redirect("/movies/add");
};

//Movie Share Controller
export const shareMovie: RequestHandler = async (req, res) => {
  //Get ID from request body
  const { id } = req.body;

  //Find movie in order to change
  const movie: Movie = await Movie.findOne(id);

  //Change the public property of movie
  movie.public ? (movie.public = false) : (movie.public = true);

  //Save the movie with changed public property
  Movie.save(movie);

  //Send status code as response
  res.sendStatus(200);
};

//Movie Like Controller
export const likeMovie: RequestHandler = async (req, res) => {
  //Get ID from request body
  const { id } = req.body;

  //Find the movie by ID
  const movie = await Movie.findOne(id);

  //Check if the movie is liked by user or not
  const likedAlready = await MovieLike.findOne({ user: req.user, movie });

  //If it's liked delete this like, if not, create a new like
  if (likedAlready) {
    await MovieLike.delete(likedAlready);
  } else {
    const like = MovieLike.create({
      user: req.user,
      movie,
    });
    await MovieLike.save(like);
  }

  //Send Status Code
  res.sendStatus(200);
};

//Movie Review Controller
export const reviewMovie: RequestHandler = async (req, res) => {
  //Get review title and content from request body
  const { title, review } = req.body;

  //Get the movie id from the referrer page's url parameter
  const movieID = req.get("Referrer").split("/").slice(-1)[0];

  //Find the movie by id
  const movie = await Movie.findOne(movieID);

  //Create a new Movie Review
  const movieReview = MovieReview.create({
    title,
    review,
    user: req.user,
    movie,
  });
  await MovieReview.save(movieReview);

  //Redirect user to the referrer page
  res.redirect(req.get("Referrer"));
};

//Movie Edit Controller
export const editMovie: RequestHandler = async (req, res) => {
  //Get edited information from request body
  const { title, description, actors, photoLink } = req.body;

  //Get movie id from referrer page
  const movieID = req.params.id;

  //Find movie according to the ID
  const movie = await Movie.findOne(movieID, { relations: ["user"] });
  if (movie.user.id != req.user["id"]) return res.redirect("/movies");

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
    return res.redirect(`/movies/edit/${movieID}`);
  }

  //Update movie
  movie.title = title;
  movie.description = description;
  movie.actors = actors;
  movie.photo = photoLink;

  Movie.save(movie);

  res.redirect("/profile/movies");
};

//Movie Delete Controller
export const deleteMovie: RequestHandler = async (req, res) => {
  //Get ID from Request Body
  const { id } = req.body;

  //Find the movie and if owner of movie is not user, go homepage
  const movie = await Movie.findOne(id, { relations: ["user"] });
  if (movie.user.id != req.user["id"]) return res.redirect("/");

  //Delete the movie
  await Movie.delete(movie);

  //Redirect user to the referrer page
  res.redirect(req.get("Referrer"));
};

//Add Star Controller
export const addStar: RequestHandler = async (req, res) => {
  //Get Star information from request body
  const { firstName, lastName, info, movies, photoLink } = req.body;

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
    return res.redirect("/stars/add");
  }

  //Create a new Star by the given information
  const star = Star.create({
    firstName,
    lastName,
    user: req.user,
    info,
    movies,
    photo: photoLink,
  });
  await Star.save(star);

  //Give the success message with request flash
  req.flash("success", "Star created succesfully");

  //Redirect user to the add star page
  res.redirect("/stars/add");
};

//Star Share Controller
export const shareStar: RequestHandler = async (req, res) => {
  //Get ID from request body
  const { id } = req.body;

  //Find movie in order to change
  const star: Star = await Star.findOne(id);

  //Change the public property of movie
  star.public ? (star.public = false) : (star.public = true);

  //Save the star with changed public property
  Star.save(star);

  //Send status code as response
  res.sendStatus(200);
};

//Star Like Controller
export const likeStar: RequestHandler = async (req, res) => {
  //Get star id from request body
  const { id } = req.body;

  //Find the user by id
  const star = await Star.findOne(id);

  //Check if the user already liked the star
  const likedAlready = await StarLikes.findOne({ user: req.user, star });

  //If already liked delete this like, if not create a new like
  if (likedAlready) {
    StarLikes.delete(likedAlready);
  } else {
    const like = StarLikes.create({
      user: req.user,
      star,
    });
    await StarLikes.save(like);
  }

  //Redirect user to the redirect page
  res.sendStatus(200);
};

//Star Review Controller
export const reviewStar: RequestHandler = async (req, res) => {
  //Get title and content of review from request body
  const { title, review } = req.body;

  //Get starID from referrer page
  const starID = req.get("Referrer").split("/").slice(-1)[0];

  //Find Star by starID
  const star = await Star.findOne(starID);

  //Create a new Star Review
  const starReview = StarReview.create({
    title,
    review,
    user: req.user,
    star,
  });
  await StarReview.save(starReview);

  //Redirect user to the referrer page
  res.redirect(req.get("Referrer"));
};

//Star Edit Controller
export const editStar: RequestHandler = async (req,res) => {
  //Get edited information from request body
  const { firstName, lastName, info, movies, photoLink } = req.body;

  //Get movie id from referrer page
  const starID = req.params.id;

  //Find movie according to the ID
  const star = await Star.findOne(starID, { relations: ["user"] });
  if (star.user.id != req.user["id"]) return res.redirect("/stars");

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
    return res.redirect(`/movies/edit/${starID}`);
  }

  //Update movie
  star.firstName = firstName;
  star.lastName = lastName;
  star.info = info;
  star.movies = movies;
  star.photo = photoLink;

  Star.save(star);

  res.redirect("/profile/stars");
}

//Star Delete Controller
export const deleteStar: RequestHandler = async (req, res) => {
  //Get ID from Request Body
  const { id } = req.body;

  //Find the movie and if owner of movie is not user, go homepage
  const star = await Star.findOne(id, { relations: ["user"] });
  if (star.user.id != req.user["id"]) return res.redirect("/");

  //Delete the movie
  await Star.delete(star);

  //Redirect user to the referrer page
  res.redirect(req.get("Referrer"));
};

