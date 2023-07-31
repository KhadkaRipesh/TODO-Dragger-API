import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsInt()
  position: number;
}
