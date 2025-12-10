import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDecorator } from '../users/users.decorator';
import type { UserDecoratorData } from '../users/users.types';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AvatarValidationPipe } from './pipes/avatar-validation.pipe';

@UseGuards(AuthGuard)
@Controller('avatars')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @Get()
  findMany(@UserDecorator() { user }: UserDecoratorData) {
    return this.avatarsService.findMany(user.id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('avatar'))
  upload(
    @UserDecorator() { user }: UserDecoratorData,
    @UploadedFile(new AvatarValidationPipe()) file: Express.Multer.File,
  ) {
    return this.avatarsService.upload(user.id, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.avatarsService.remove(id);
  }
}
