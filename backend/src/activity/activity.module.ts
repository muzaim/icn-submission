import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { AuthModule } from '../auth/auth.module'; // <- import AuthModule

@Module({
  imports: [TypeOrmModule.forFeature([Activity]), AuthModule],
  providers: [ActivityService],
  controllers: [ActivityController],
  exports: [ActivityService],
})
export class ActivityModule {}
