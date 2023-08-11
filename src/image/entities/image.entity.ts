import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm'

@Entity()
export class Imate {
   @PrimaryGeneratedColumn()
    id:number;

    @Column()
    author:string;

    @Column()
    content:string;
    
    @Column()
    fileName:string;

    @Column()
    isSave:boolean;
}
