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
import { TodoStatus } from './dto/todo-status.enum';
import { todo } from 'node:test';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private readonly repoService: Repository<Todo>,
    private userService: UsersService,
  ) {}

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
  //  get all tasks created by a user.
  async getAllTodos(id: number) {
    return this.repoService.find({
      where: { fromUser: id },
      select: ['id', 'content', 'position', 'status'],
      order: {
        position: 'ASC',
      },
    });
  }

  //  get all task of a user in specific status

  async getTaskFromStatus(id: number, status: TodoStatus) {
    return this.repoService.find({
      where: { fromUser: id, status: status },
      select: ['id', 'content', 'position'],
      order: {
        position: 'ASC',
      },
    });
  }

  // update status of the tasks
  // async updateStatus(userId: number, updateTodoDto: UpdateTodoDto) {
  //   const { id, position, status } = updateTodoDto;
  //   const todo = await this.repoService.findOne({
  //     where: { id: id, fromUser: userId },
  //   });
  //   todo.status = status;
  //   todo.position = position;
  //   console.log(todo);
  //   todo.status = updateTodoDto.status;
  //   await this.repoService.save(todo);
  //   return this.getTaskFromStatus(userId, status);
  // }

  //  Dragging function

  async dragTodos(
    userId: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<Todo[]> {
    const { id, position, status } = updateTodoDto;
    const todos = await this.repoService.find({
      where: { fromUser: userId },
      order: { position: 'ASC' },
    });

    const todoToDrag = todos.find((todo) => todo.id === id);

    if (!todoToDrag) {
      throw new Error('Todo not found.');
    }
    if (todoToDrag.status !== status) {
      todoToDrag.status = updateTodoDto.status;
    }

    const updatedTodos = todos.filter(
      (todo) => todo.id !== id && todo.status === status,
    );
    updatedTodos.splice(position - 1, 0, todoToDrag);

    for (let i = 0; i < updatedTodos.length; i++) {
      if (updatedTodos[i].id === id) {
        updatedTodos[i].position = position;
      } else if (updatedTodos[i].position !== i + 1) {
        updatedTodos[i].position = i + 1;
      }
    }
    await this.repoService.save(updatedTodos);

    return this.getTaskFromStatus(userId, status);
  }
}

// const existingPositions = updatedTodos;
//   .map((todo) => todo.position)
//   .sort((a, b) => a - b);
// console.log(existingPositions);
// const positionExists = existingPositions.includes(updateTodoDto.position);

// if (!positionExists) {
//   throw new BadRequestException('Invalid position.');
// }
// for (let i = 0; i < updatedTodos.length; i++) {
//   updatedTodos[i].position = existingPositions[i];
// }

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
