import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IFileService } from '../../providers';
import { AVATARS_LIMIT, AVATARS_FOLDER } from './constants/avatar.const';
import { AvatarsRepository } from './avatars.repository';

@Injectable()
export class AvatarsService {
  private readonly logger = new Logger(AvatarsService.name);

  constructor(
    private avatarsRepository: AvatarsRepository,
    private filesService: IFileService,
  ) {}

  findMany(userId: string) {
    try {
      return this.avatarsRepository.findManyByUserId(userId);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async upload(userId: string, file: Express.Multer.File) {
    const { fieldname, mimetype, buffer, originalname, size } = file;
    const avatars = await this.avatarsRepository.findManyByUserId(userId);
    if (avatars.length >= AVATARS_LIMIT) {
      this.logger.debug(`User's id=${userId} avatars limit reached`);
      throw new BadRequestException('Avatars limit reached');
    }
    try {
      await this.filesService.uploadFile({
        file: {
          fieldname,
          originalname,
          mimetype,
          buffer,
          size,
        },
        folder: AVATARS_FOLDER,
        name: originalname,
      });
      const avatar = await this.avatarsRepository.createOne(
        userId,
        originalname,
      );

      return avatar;
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async remove(id: string) {
    const avatar = await this.avatarsRepository.findOneById(id);
    if (!avatar) {
      this.logger.debug(`No avatar with id=${id}`);
      throw new NotFoundException(`No avatar with id=${id}`);
    }
    try {
      await this.avatarsRepository.softDeleteById(id);
      await this.filesService.removeFile({
        path: `${AVATARS_FOLDER}/${avatar.filename}`,
      });
      return true;
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }
}
