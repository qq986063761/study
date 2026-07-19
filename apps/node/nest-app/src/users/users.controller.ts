import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import type { UserInput } from './dto/user-input.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query('q') search = '') {
    return this.usersService.findAll(search);
  }

  @Post()
  create(@Body() input: UserInput) {
    return this.usersService.create(input);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() input: UserInput) {
    return this.usersService.update(Number(id), input);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }
}
