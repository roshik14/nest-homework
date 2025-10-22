import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserResponseDto,
  UsersQueryDto,
  UsersResponseDto,
} from './dto/users.dto';
import { compare } from 'bcrypt';
import { UsersRepository } from './users.repository';
import { UserTokensService } from '../user-tokens/user-tokens.service';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private userTokenService: UserTokensService,
  ) {}

  async findMe(token?: string): Promise<User | null> {
    console.log(token);
    const userTokenData = await this.userTokenService.getToken(token ?? '');
    if (!userTokenData) {
      throw new UnauthorizedException('Not authorized');
    }
    const user = await this.findOne(userTokenData.userId);
    if (!user) {
      throw new NotFoundException('No such user');
    }
    return user;
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneById(id);
  }

  async findOneByEmail(email: string) {
    return this.usersRepository.findOneByEmail(email);
  }

  async createOne(userData: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneByEmail(userData.email);
    if (user) {
      throw new ConflictException('Email already has used');
    }
    return this.usersRepository.save(userData);
  }

  async updateOne(
    id: number,
    userData: UpdateUserDto,
  ): Promise<UpdateUserResponseDto | null> {
    const existedUser = await this.usersRepository.findOneById(id);
    if (!existedUser) {
      throw new NotFoundException(`User with id=${id} is not existing `);
    }
    await this.usersRepository.update({ id }, userData);
    return {
      id,
      ...userData,
    };
  }

  async findMany(usersQuery: UsersQueryDto): Promise<UsersResponseDto> {
    const [data, count] = await this.usersRepository.findMany(usersQuery);

    return {
      data,
      count,
      offset: usersQuery.offset,
      limit: usersQuery.limit,
    };
  }

  async delete(id: number) {
    const existedUser = await this.usersRepository.findOneById(id);
    if (!existedUser) {
      throw new NotFoundException(`User with id=${id} is not existing `);
    }
    await this.userTokenService.deleteTokenByUserId(id);
    return await this.usersRepository.softDelete(existedUser.id);
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const userId = 1;
    const user = await this.usersRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatch = await compare(currentPassword, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException('Password is invalid');
    }

    await this.usersRepository.update(
      { id: user.id },
      { password: newPassword },
    );
    return true;
  }
}
