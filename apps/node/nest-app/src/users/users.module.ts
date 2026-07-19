import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [PrismaService, UsersService],
})
export class UsersModule {}
