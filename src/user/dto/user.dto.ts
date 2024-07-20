import { Notes, UserRole } from '@prisma/client';

export class UserDto {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  notes: Notes[];

  constructor(data: UserDto) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.role = data.role;
    this.notes = data.notes;
  }
}
