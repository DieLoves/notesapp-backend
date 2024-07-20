import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/services/prisma.service'
import { CreateNoteDto } from './dto/create-note.dto'
import { UpdateNoteDto } from './dto/update-note.dto'

@Injectable()
export class NotesService {
  constructor(private prismaService: PrismaService) {}
  create(createNoteDto: CreateNoteDto, userId: string) {
    return this.prismaService.notes.create({
      data: {
        ...createNoteDto,
        user: {
          connect: {
            id: 
          }
        }
      },
    });
  }

  findAll() {
    return `This action returns all notes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
