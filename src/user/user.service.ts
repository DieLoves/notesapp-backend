import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { hash } from 'argon2';
import { AuthDto } from 'src/auth/dto/auth-dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: AuthDto) {
    return await this.prisma.users.create({
      data: {
        email: dto.email,
        password: await hash(dto.password),
        username: dto.username || 'Unknown user',
      },
      include: { sessions: true, notes: true },
    });
  }

  async getById(id: string) {
    return await this.prisma.users.findUnique({
      where: { id },
      include: { sessions: true, notes: true },
    });
  }

  async getByEmail(email: string) {
    return await this.prisma.users.findUnique({
      where: { email },
      include: { sessions: true, notes: true },
    });
  }

  async update(id: string, dto: Partial<Omit<Users, 'id'>>) {
    return await this.prisma.users.update({
      where: {
        id,
      },
      include: { sessions: true, notes: true },
      data: dto,
    });
  }

  async delete(id: string) {
    return await this.prisma.users.delete({
      where: {
        id,
      },
      include: { sessions: true, notes: true },
    });
  }
}
