import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Star extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: "text", nullable: true })
  info;

  @Column({ nullable: true })
  movies: string;

  @Column({ nullable: true })
  photo: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ default: false })
  public: boolean;

  //This helper method is for getting the stars of given user
  static async getStarsByUser(userID: string) {
    const stars = await this.createQueryBuilder("star")
      .leftJoinAndSelect("star.user", "user")
      .where("user.id = :id", { id: userID })
      .getManyAndCount();

    return stars;
  }

  //This helper method is getting all public stars
  static async getSharedStars() {
    const stars = await this.createQueryBuilder("star")
      .leftJoinAndSelect("star.user", "user")
      .where("public = true")
      .getManyAndCount();

    return stars;
  }
}
