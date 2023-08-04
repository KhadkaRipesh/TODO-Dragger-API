import { IsNotEmpty, IsInt, IsString, IsPositive } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty({ message: 'The task cannot be empty. ' })
  content: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive({ message: 'Position must be a positive.' })
  position: number;
}
