import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/users.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserResponseDto,
  UsersQueryDto,
  UsersResponseDto,
} from './dto';
import { compare } from 'bcrypt';
import { UsersRepository } from './users.repository';
import { UserTokensService } from '../user-tokens/user-tokens.service';
import { AvatarsRepository } from '../avatars/avatars.repository';
import { Avatar } from '../avatars/entities/avatars.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private usersRepository: UsersRepository,
    private userTokenService: UserTokensService,
    private avatarsRepository: AvatarsRepository,
  ) {}

  async findOne(id: string): Promise<User | null | undefined> {
    try {
      return this.usersRepository.findOneById(id);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async findOneByEmail(email: string): Promise<User | null | undefined> {
    try {
      return this.usersRepository.findOneByEmail(email);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async createOne(userData: CreateUserDto): Promise<User | undefined> {
    const user = await this.findOneByEmail(userData.email);
    if (user) {
      this.logger.debug(`User with email = ${userData.email} already exists`);
      throw new ConflictException('Email already has used');
    }
    try {
      return this.usersRepository.saveOne(userData);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async updateOne(
    id: string,
    userData: UpdateUserDto,
  ): Promise<UpdateUserResponseDto | null | undefined> {
    const existedUser = await this.findOne(id);
    if (!existedUser) {
      this.logger.debug(`User with id = ${id} not found`);
      throw new NotFoundException(`User with id=${id} is not existing `);
    }
    try {
      await this.usersRepository.updateOne(id, userData);
      return {
        id,
        ...userData,
      };
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async findMany({
    limit,
    offset,
    sort,
    username,
  }: UsersQueryDto): Promise<UsersResponseDto | undefined> {
    try {
      const [data, count] = await this.usersRepository.findMany({
        limit,
        offset,
        sort,
        username,
      });

      return {
        data,
        count,
        offset,
        limit,
      };
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async delete(id: string) {
    const existedUser = await this.usersRepository.findOneById(id);
    if (!existedUser) {
      this.logger.debug(`User with id = ${id} not found`);
      throw new NotFoundException(`User with id=${id} is not existing`);
    }
    try {
      await this.userTokenService.deleteTokenByUserId(id);
      return this.usersRepository.softDeleteById(existedUser.id);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    userId: string,
  ) {
    const user = await this.findOne(userId);
    if (!user) {
      this.logger.debug(`User with id = ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    const isPasswordMatch = await compare(currentPassword, user.password);

    if (!isPasswordMatch) {
      this.logger.debug(`Users id = ${userId} password is invalid `);
      throw new BadRequestException('Password is invalid');
    }
    try {
      return this.usersRepository.updateOne(user.id, { password: newPassword });
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async getMostActive(minAge: number, maxAge: number) {
    try {
      const users = await this.usersRepository.findMostActiveUsers(
        minAge,
        maxAge,
      );
      const avatars = await this.avatarsRepository.findByManyUserIds(
        users.map(({ user_id }) => user_id),
      );
      const lastAvatarsByUserId = new Map<string, Avatar>();
      avatars.forEach((avatar) => {
        if (!lastAvatarsByUserId.has(avatar.user.id)) {
          lastAvatarsByUserId.set(avatar.user.id, avatar);
        }
      });

      return users.map((user) => {
        const lastAvatar = lastAvatarsByUserId.get(user.user_id);
        return {
          id: user.user_id,
          age: user.user_age,
          email: user.user_email,
          about: user.about_info,
          lastAvatar: lastAvatar
            ? {
                id: lastAvatar.id,
                filename: lastAvatar.filename,
              }
            : null,
        };
      });
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async setBalance(userId: string, balance: number) {
    try {
      return this.usersRepository.updateOne(userId, { balance });
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async setBalanceToAllUsers(balance: number) {
    try {
      return this.usersRepository.updateAll({ balance });
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }
}
