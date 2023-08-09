import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm'

@Entity()
export class Imafe {
   @PrimaryGeneratedColumn()
    id:number;

    @Column()
    author:string;

    @Column()
    info:string;
    
    @Column()
    fileName:string;
}
