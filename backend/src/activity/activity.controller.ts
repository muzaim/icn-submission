// src/cuti/cuti.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFile,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../common/decorator/user.decorator';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @User() user: { id: number; email: string },
  ) {
    return this.activityService.create({
      ...createActivityDto,
      user_id: user.id,
    });
  }

  @Post('get-by-date')
  @UseGuards(AuthGuard('jwt'))
  async findByDate(
    @Body('date') date: string,
    @User() user: { id: number; email: string },
  ) {
    return this.activityService.findByDate(date, user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: number,
    @Body() updateActivityDto: CreateActivityDto,
    @UploadedFile() foto: Express.Multer.File,
  ) {
    const existingActivity = await this.activityService.findOne(id);

    if (!existingActivity) {
      throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
    }

    return this.activityService.update(id, updateActivityDto);
  }

  @Get()
  async findAll(): Promise<Activity[]> {
    return this.activityService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findById(id: number): Promise<Activity> {
    const cuti = await this.activityService.findOne(id);
    return cuti;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: number): Promise<Activity> {
    const result = await this.activityService.delete(id);

    return result;
  }

  @Put('done/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateToDone(@Param('id') id: number): Promise<Activity> {
    return this.activityService.updateToDone(id);
  }
}
