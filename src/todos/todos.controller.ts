import { Controller, Get, Param, Put } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './todos.interface';
// import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  getTodos(): Todo[] {
    return this.todosService.getTodos();
  }

  @Put(':todoId/drag/:todoDrag')
  dragOrder(
    @Param('todoId') todoId: string,
    @Param('todoDrag') todoDrag: string,
  ): Todo[] {
    return this.todosService.dragTodos(+todoId, +todoDrag);
  }

  // @Post()
  // async createTodo(createTodoDto: CreateTodoDto) {
  //   return this.todosService.createTask(createTodoDto);
  // }
}
