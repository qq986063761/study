import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UserInput } from './dto/user-input.dto';

type UserRecord = {
  id: number;
  username: string;
  email: string;
  age: number;
  status: 0 | 1;
  createdAt: Date;
};

type UserResponse = Omit<UserRecord, 'createdAt'> & {
  created_at: Date;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search = '') {
    try {
      const rows = await this.prisma.user.findMany({
        where: this.buildSearchWhere(search),
        orderBy: { id: 'desc' },
      });

      return rows.map((row) => this.toResponse(row as UserRecord));
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async create(input: UserInput) {
    try {
      const user = this.normalizeInput(input);
      const created = await this.prisma.user.create({
        data: user,
      });

      return this.toResponse(created as UserRecord);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async update(id: number, input: UserInput) {
    try {
      this.assertId(id);
      await this.findOne(id);

      const user = this.normalizeInput(input);
      const updated = await this.prisma.user.update({
        where: { id },
        data: user,
      });

      return this.toResponse(updated as UserRecord);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: number) {
    try {
      this.assertId(id);
      await this.findOne(id);
      await this.prisma.user.delete({
        where: { id },
      });

      return { ok: true };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private async findOne(id: number) {
    this.assertId(id);
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  private buildSearchWhere(search: string) {
    const keyword = search.trim();

    if (!keyword) {
      return undefined;
    }

    const lowerKeyword = keyword.toLowerCase();
    const conditions: Record<string, unknown>[] = [
      { username: { contains: keyword } },
      { email: { contains: keyword } },
    ];
    const numberValue = Number(keyword);

    if (Number.isInteger(numberValue)) {
      conditions.push({ id: numberValue }, { age: numberValue });

      if (numberValue === 0 || numberValue === 1) {
        conditions.push({ status: numberValue });
      }
    }

    if (['active', 'enabled', '启用'].includes(lowerKeyword)) {
      conditions.push({ status: 1 });
    }

    if (['inactive', 'disabled', '停用'].includes(lowerKeyword)) {
      conditions.push({ status: 0 });
    }

    return { OR: conditions };
  }

  private normalizeInput(input: UserInput): UserInput {
    const username = String(input.username || '').trim();
    const email = String(input.email || '').trim().toLowerCase();
    const age = Number(input.age);
    const status = Number(input.status);

    if (!username) {
      throw new BadRequestException('用户名不能为空');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('邮箱格式不正确');
    }

    if (!Number.isInteger(age) || age < 0 || age > 150) {
      throw new BadRequestException('年龄必须是 0 到 150 之间的整数');
    }

    if (status !== 0 && status !== 1) {
      throw new BadRequestException('状态只能是 0 或 1');
    }

    return {
      username,
      email,
      age,
      status,
    };
  }

  private assertId(id: number) {
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException('用户 ID 不正确');
    }
  }

  private toResponse(user: UserRecord): UserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      age: user.age,
      status: user.status,
      created_at: user.createdAt,
    };
  }

  private handleDatabaseError(error: unknown): never {
    if (error instanceof HttpException) {
      throw error;
    }

    const message = error instanceof Error ? error.message : String(error);
    throw new ServiceUnavailableException(`数据库访问失败：${message}`);
  }
}
