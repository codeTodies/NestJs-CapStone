import {Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn} from 'typeorm'
import { User } from 'src/user/entities/user.entity';
@Entity()
export class Imate {
   @PrimaryGeneratedColumn()
    id:number;

    @Column()
    content:string;
    
    @Column()
    fileName:string;

    @Column()
    isSave:boolean;

    @ManyToOne(() => User, user => user.id) 
    @JoinColumn({ name: 'AuthorID', referencedColumnName: 'id' }) 
    authorID: number; 
}
