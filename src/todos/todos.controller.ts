import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoStatus } from './dto/todo-status.enum';
// import { Todo } from './todos.interface';
// import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  // @Get()
  // getTodos(): Todo[] {
  //   return this.todosService.getTodos();
  // }

  // @Put(':todoId/drag/:todoDrag')
  // dragOrder(
  //   @Param('todoId') todoId: string,
  //   @Param('todoDrag') todoDrag: string,
  // ): Todo[] {
  //   return this.todosService.dragTodos(+todoId, +todoDrag);
  // }

  @Post(':id')
  async createTodo(
    @Param('id') id: string,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    return this.todosService.createTask(+id, createTodoDto);
  }
  @Get(':id')
  getAllTodos(@Param('id') id: string) {
    return this.todosService.getAllTodos(+id);
  }

  @Patch(':id')
  dragTodo(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updatetodoDto: UpdateTodoDto,
  ) {
    return this.todosService.dragTodos(+id, updatetodoDto);
  }

  @Get(':id/:status')
  getTaskAsStatus(
    @Param('id') id: string,
    @Param('status') status: TodoStatus,
  ) {
    return this.todosService.getTaskFromStatus(+id, status);
  }
}
