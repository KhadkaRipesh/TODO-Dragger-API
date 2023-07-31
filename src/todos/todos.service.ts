import { Injectable } from '@nestjs/common';
import { Todo } from './todos.interface';
// import { CreateTodoDto } from './dto/create-todo.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Todo } from './enitites/todo.entity';
// import { Repository } from 'typeorm';

@Injectable()
export class TodosService {
  // constructor(@InjectRepository(Todo) readonly repoService: Repository<Todo>) {}
  todos: Todo[] = [
    {
      id: 1,
      content: 'This is a task 1.',
    },
    {
      id: 2,
      content: 'This is a task 2.',
    },
    {
      id: 3,
      content: 'This is a task 3.',
    },
    {
      id: 4,
      content: 'This is a task 4.',
    },
    {
      id: 5,
      content: 'This is a task 5.',
    },
  ];

  getTodos(): Todo[] {
    return this.todos;
  }

  dragTodos(todoId: number, todoDrag: number): Todo[] {
    const todoIndex = this.todos.findIndex((todo) => todo.id === todoId);
    console.log(this.todos);
    if (todoIndex < 0) {
      return this.todos;
    }
    console.log('index to remove', todoIndex);
    const [todo] = this.todos.splice(todoIndex, 1);
    console.log('Removed element:', todo);
    this.todos.splice(todoDrag - 1, 0, todo);

    console.log(this.todos);
    return this.todos;
  }

  // createTask(createTodoDto: CreateTodoDto): Promise<Todo> {
  //   console.log(createTodoDto.content);
  //   console.log(createTodoDto.position);
  //   const { content, position } = createTodoDto;
  //   const newTodo = this.repoService.create({ content, position });
  //   return this.repoService.save(newTodo);
  // }
}
