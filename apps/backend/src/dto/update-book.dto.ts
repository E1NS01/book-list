import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  title: string;
}
