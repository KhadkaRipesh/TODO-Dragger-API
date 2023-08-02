import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'todos' })
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  position: number;

  @Column()
  fromUser: number;
  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn({ name: 'fromUser' })
  user: User;
}
