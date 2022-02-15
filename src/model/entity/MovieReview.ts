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
export class MovieReview extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text" })
  review;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.title, { onDelete: "CASCADE" })
  movie: Movie;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  //This helper method is for getting reviews of given movie
  static async getReviewsByMovie(movieID: string) {
    const reviews = await this.createQueryBuilder("review")
      .leftJoinAndSelect("review.user", "user")
      .leftJoinAndSelect("review.movie", "movie")
      .where("movie.id = :id ", { id: movieID })
      .getManyAndCount();

    return reviews;
  }
}
