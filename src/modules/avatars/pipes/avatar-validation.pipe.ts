import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import {
  AVATAR_ALLOWED_MIMES,
  AVATAR_MAX_SIZE,
} from '../constants/avatar.const';

@Injectable()
export class AvatarValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file');
    }
    if (
      file.size > AVATAR_MAX_SIZE ||
      !AVATAR_ALLOWED_MIMES.includes(file.mimetype)
    ) {
      throw new BadRequestException('File is not valid');
    }
    return file;
  }
}
