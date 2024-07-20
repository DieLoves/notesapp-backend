import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';

export function Auth() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
