import { User } from "../model/entity/User";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { config } from "dotenv";
import { Request } from "express";
import passport from "passport";

//For .env variables
config();

export default function () {
  //PassportJS Serialize User function
  passport.serializeUser((user, done) => {
    done(null, user["id"]);
  });

  //PassportJS Deserialize User function
  passport.deserializeUser(async (id:string, done) => {
    const user = await User.findOne({ id });
    done(null, user);
  });

  //Facebook Login Strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: "https://movie-app-block-buster.herokuapp.com/auth/facebook/callback",
        profileFields: ["id", "displayName", "email", "picture"],
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        //Find user which facebookID fields equals to id that comes from facebook
        let user = await User.findOne({ facebookID: profile._json.id });

        //If such user does not exists, do the following controls
        if (!user) {
          //Check if any user exists with the emails that comes from facebook
          //If there is, send error
          const existingUser = await User.findOne({
            email: profile._json.email,
          });
          if (existingUser) {
            req.flash("errors", "This user's email addres already exists");
            return done(null, null);
          }

          //Get user data from facebook and create a new user
          const firstName = profile._json.name.split(" ")[0];
          const lastName = profile._json.name.split(" ")[1];
          const email = profile._json.email;
          const facebookID = profile._json.id;
          const photo = profile.photos[0].value;
          const newUser = User.create({
            facebookID,
            firstName,
            lastName,
            email,
            photo,
          });
          await User.save(newUser);
          done(null, newUser);
        } else {
          done(null, user);
        }
      }
    )
  );

  //Google Login Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "https://movie-app-block-buster.herokuapp.com/auth/google/callback",
        passReqToCallback: true,
      },
      async (req:Request, accessToken:string, refreshToken:string, profile:any, done:any) => {
        //Find user which facebookID fields equals to id that comes from facebook
        let user = await User.findOne({ googleID: profile.id });

        //If such user does not exists, do the following controls
        if (!user) {
          //Check if any user exists with the emails that comes from facebook
          //If there is, send error
          const existingUser = await User.findOne({ email: profile.email });
          if (existingUser) {
            req.flash("errors", "This user's email addres already exists");
            return done(null, null);
          }

          //Get user data from facebook and create a new user
          const firstName = profile.given_name;
          const lastName = profile.family_name;
          const email = profile.email;
          const googleID = profile.id;
          const photo = profile.photos[0].value;
          const newUser = User.create({
            googleID,
            firstName,
            lastName,
            email,
            photo,
          });
          await User.save(newUser);
          done(null, newUser);
        } else {
          done(null, user);
        }
      }
    )
  );
}
