import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique} from "typeorm";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:'text', nullable:true})
    photo;

    @Column({nullable:true})
    facebookID:string

    @Column({nullable:true})
    googleID:string

    @Column({unique:true,nullable:true})
    userName:string

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique:true})
    email: string;

    @Column({nullable:true})
    password: string;

}
