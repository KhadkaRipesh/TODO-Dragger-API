import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './enitites/todo.entity';
// import { Todo } from './todos.interface';
// import { CreateTodoDto } from './dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
// import { Todo } from './enitites/todo.entity';
import { Repository } from 'typeorm';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private readonly repoService: Repository<Todo>,
    private userService: UsersService,
  ) {}

  // doing statically

  // todos: Todo[] = [
  //   {
  //     id: 1,
  //     content: 'This is a task 1.',
  //   },
  //   {
  //     id: 2,
  //     content: 'This is a task 2.',
  //   },
  //   {
  //     id: 3,
  //     content: 'This is a task 3.',
  //   },
  //   {
  //     id: 4,
  //     content: 'This is a task 4.',
  //   },
  //   {
  //     id: 5,
  //     content: 'This is a task 5.',
  //   },
  // ];
  // getTodos(): Todo[] {
  //   return this.todos;
  // }
  // dragTodos(todoId: number, todoDrag: number): Todo[] {
  //   const todoIndex = this.todos.findIndex((todo) => todo.id === todoId);
  //   console.log(this.todos);
  //   if (todoIndex < 0) {
  //     return this.todos;
  //   }
  //   console.log('index to remove', todoIndex);
  //   const [todo] = this.todos.splice(todoIndex, 1);
  //   console.log('Removed element:', todo);
  //   this.todos.splice(todoDrag - 1, 0, todo);
  //   console.log(this.todos);
  //   return this.todos;
  // }
  async createTask(id: number, createTodoDto: CreateTodoDto) {
    const user = await this.userService.getUser(id);
    console.log('User details:', user);
    if (!user) {
      throw new BadRequestException('The user is not registered.');
    }
    const newData = {
      ...createTodoDto,
      fromUser: id,
    };
    console.log(newData);

    return this.repoService.save(newData);
  }

  async getAllTodos(id: number) {
    return this.repoService.find({
      where: { fromUser: id },
      select: ['id', 'content'],
      order: {
        position: 'ASC',
      },
    });
  }

  // flipping the tasks

  // async dragTodos(todoId: number, todoDrag: number): Promise<Todo[]> {
  //   const todoToDrag = await this.repoService.findOne({
  //     where: { id: todoId },
  //   });
  //   if (!todoDrag) {
  //     throw new Error();
  //   }
  //   const todoToUpdate = await this.repoService.find({
  //     where: { position: todoDrag },
  //   });

  //   let oldPosition = todoToDrag.position;
  //   console.log('position to change: ', oldPosition);
  //   if (todoToUpdate.length > 0) {
  //     for (const todo of todoToUpdate) {
  //       if (todo.id === todoToDrag.id) {
  //         continue;
  //       }
  //       todo.position = oldPosition;
  //       oldPosition = todoDrag;

  //       await this.repoService.save(todo);
  //     }
  //     todoToDrag.position = oldPosition;

  //     await this.repoService.save(todoToDrag);
  //   }
  //   return this.getAllTodos();
  // }

  //  Dragging function

  async dragTodos(
    userId: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<Todo[]> {
    const { id, position } = updateTodoDto;
    const todos = await this.repoService.find({ where: { fromUser: userId } });
    console.log('extracted todos', todos);
    const todoToDrag = todos.find((todo) => todo.id === id);
    if (!todoToDrag) {
      throw new Error('Todo not found.');
    }

    const updatedTodos = todos.filter((todo) => todo.id !== id);
    console.log('To update todoss', updatedTodos);
    updatedTodos.splice(position - 1, 0, todoToDrag);
    console.log('updated todos', updatedTodos);

    const existingPositions = updatedTodos
      .map((todo) => todo.position)
      .sort((a, b) => a - b);
    console.log(existingPositions);
    const positionExists = existingPositions.includes(updateTodoDto.position);

    if (!positionExists) {
      throw new BadRequestException('Invalid position.');
    }
    for (let i = 0; i < updatedTodos.length; i++) {
      updatedTodos[i].position = existingPositions[i];
    }

    await this.repoService.save(updatedTodos);

    return this.getAllTodos(userId);
  }
}
