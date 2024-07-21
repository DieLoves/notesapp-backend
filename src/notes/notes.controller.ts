import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decoration/auth.decorator';
import { CurrentUser } from 'src/auth/decoration/user.decorator';
import { NoteDto } from './notes.dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async create(@Body() dto: NoteDto, @CurrentUser('id') userId: string) {
    return await this.notesService.create(dto, userId);
  }

  @HttpCode(200)
  @Get()
  @Auth()
  async getAll(@CurrentUser('id') userId: string) {
    return this.notesService.getAll(userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async update(
    @Body() dto: NoteDto,
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.notesService.update(dto, id, userId);
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async delete(@Param('id') id: string) {
    return this.notesService.delete(id);
  }
}
