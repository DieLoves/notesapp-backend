import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class NoteDto {
  @IsString()
  @IsOptional()
  @MinLength(1, {
    message: 'Title should be at least 1 character long',
  })
  title: string;

  @IsString()
  @IsOptional()
  @MinLength(5, {
    message: 'Content should be at least 1 character long',
  })
  content: string;

  @IsBoolean()
  @IsOptional()
  isPrimary: boolean;

  @IsBoolean()
  @IsOptional()
  isHidden: boolean;
}
