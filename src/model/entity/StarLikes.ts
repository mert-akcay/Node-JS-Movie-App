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
export class StarLikes extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Star, (star) => star.id , {onDelete:'CASCADE'})
  star: Star;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  //This helper method is for checking the star is liked by given user or not
  static async checkLiked(user:any, star: Star) {
    const like = await this.findOne({ user, star });
    if (like) {
      return true;
    } else {
      return false;
    }
  }

  //This helper method is for getting a user's all liked stars
  static async getLikedStarByUser(userID:string) {
    const starArr = [];
    const likes = await this.createQueryBuilder("starlikes")
      .leftJoin("starlikes.user", "user")
      .leftJoinAndSelect("starlikes.star", "star")
      .where("user.id = :ID", { ID: userID })
      .getMany();

    likes.forEach((like) => {
      starArr.push(like.star.id);
    });

    return starArr;
  }

  //This helper method is for getting a Star's total like number
  static async getStarLikesCount(starID:string) {
    const likes = await this.createQueryBuilder("starlikes")
      .leftJoin("starlikes.star","star")
      .where("star.id = starID", {starID})
      .getCount()

    return likes;
  }

}
