import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  photo: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ default: false })
  public: boolean;

  @Column()
  actors: string;

  //This helper method is for getting movies by given user id
  static async getMoviesByUser(userID: string) {
    const movies = await this.createQueryBuilder("movie")
      .leftJoinAndSelect("movie.user", "user")
      .where("user.id = :id", { id: userID })
      .getManyAndCount();

    return movies;
  }

  //This helper method is for getting all public movies
  static async getSharedMovies() {
    const movies = await this.createQueryBuilder("movie")
      .leftJoinAndSelect("movie.user", "user")
      .where("public = true")
      .getManyAndCount();

    return movies;
  }
}
