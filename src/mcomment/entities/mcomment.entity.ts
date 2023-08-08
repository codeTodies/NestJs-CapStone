import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity()
export class Mcomment {
    @PrimaryGeneratedColumn()
    id: number;

}
