import { IsString, MinLength } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @MinLength(1, {
    message: 'Title should be at least 1 character long',
  })
  title: string;

  @IsString()
  @MinLength(5, {
    message: 'Content should be at least 1 character long',
  })
  content: string;
}
