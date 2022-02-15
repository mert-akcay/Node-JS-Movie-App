import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Movie } from "./Movie";
import { Star } from "./Star";
import { User } from "./User";

@Entity()
export class StarReview extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text" })
  review;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Star, (star) => star.id, { onDelete: "CASCADE" })
  star: Star;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  //This helper method is for getting reviews of given star
  static async getReviewsByStar(starID: string) {
    const reviews = await this.createQueryBuilder("review")
      .leftJoinAndSelect("review.user", "user")
      .leftJoinAndSelect("review.star", "star")
      .where("star.id = :id ", { id: starID })
      .getManyAndCount();

    return reviews;
  }
}
