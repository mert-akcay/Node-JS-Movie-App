import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Movie } from "./Movie";
import { User } from "./User";

@Entity()
export class MovieLike extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.title, { onDelete:'CASCADE' })
  movie: Movie;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  //This helper method is for checking the movie is liked by given user or not
  static async checkLiked(user:any, movie: Movie) {
    const like = await this.findOne({ user, movie });
    if (like) {
      return true;
    } else {
      return false;
    }
  }

  //This helper method is for getting a user's all liked movies
  static async getLikedMovieByUser(userID:string) {
    const movieArr = [];
    const likes = await this.createQueryBuilder("movielikes")
      .leftJoin("movielikes.user", "user")
      .leftJoinAndSelect("movielikes.movie", "movie")
      .where("user.id = :ID", { ID: userID })
      .getMany();

    likes.forEach((like) => {
      movieArr.push(like.movie.id);
    });

    return movieArr;
  }

  //This method is for getting a movie's total like count
  static async getMovieLikesCount(movieID:string) {
    const likes = await this.createQueryBuilder("movielikes")
      .leftJoin("movielikes.movie", "movie")
      .where("movie.id = movieID", { movieID })
      .getCount();

    return likes;
  }

}
