import { IsString, MinLength } from 'class-validator';

export class CreateSubtaskDto {
  @IsString()
  @MinLength(2)
  title!: string;
}
