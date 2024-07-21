import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { NoteDto } from './notes.dto';

@Injectable()
export class NotesService {
  constructor(private prismaService: PrismaService) {}

  async getAll(userId: string) {
    return this.prismaService.notes.findMany({
      where: {
        userId,
      },
    });
  }
  async create(dto: NoteDto, userId: string) {
    return await this.prismaService.notes.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async update(dto: Partial<NoteDto>, taskId: string, userId: string) {
    return await this.prismaService.notes.update({
      where: {
        id: taskId,
        userId,
      },
      data: dto,
    });
  }

  async delete(taskId: string) {
    return await this.prismaService.notes.delete({
      where: {
        id: taskId,
      },
    });
  }
}
