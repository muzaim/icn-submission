import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async findAll() {
    return this.activityRepository.find().then((activity) => {
      const baseUrl = `${process.env.BASE_URL}/uploads/`;

      return activity.map((activity) => {
        return activity;
      });
    });
  }

  async findOne(id: number) {
    return this.activityRepository
      .findOne({ where: { id } })
      .then((activity) => {
        const baseUrl = `${process.env.BASE_URL}/uploads/`;

        return activity;
      });
  }

  async findByDate(date: string, userId: number) {
    const start = new Date(date + ' 00:00:00');
    const end = new Date(date + ' 23:59:59');

    const activity = await this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.tanggal BETWEEN :start AND :end', { start, end })
      .andWhere('activity.user_id = :userId', { userId }) // filter by user
      .orderBy(
        `CASE 
           WHEN activity.status = 'On Progress' THEN 1 
           WHEN activity.status = 'Done' THEN 2 
           WHEN activity.status = 'Cancelled' THEN 3
         END`,
      )
      .addOrderBy('activity.tanggal', 'ASC')
      .getMany();

    return activity;
  }

  async create(data: Partial<Activity>) {
    const activity = this.activityRepository.create({
      ...data,
      status: 'On Progress',
    });

    return this.activityRepository.save(activity);
  }

  async update(
    id: number,
    updateActivityDto: CreateActivityDto,
  ): Promise<Activity> {
    const existingActivity = await this.activityRepository.findOne({
      where: { id },
    });

    if (!existingActivity) {
      throw new Error('Activity not found');
    }

    // Merge existing entity dengan DTO
    const updatedActivity = this.activityRepository.merge(
      existingActivity,
      updateActivityDto,
    );

    return this.activityRepository.save(updatedActivity);
  }

  async delete(id: number): Promise<Activity> {
    const existingActivity = await this.activityRepository.findOne({
      where: { id },
    });

    if (!existingActivity) {
      throw new Error('Activity not found');
    }

    existingActivity.status = 'Cancelled';
    return this.activityRepository.save(existingActivity);
  }

  async updateToDone(id: number): Promise<Activity> {
    const existingActivity = await this.activityRepository.findOne({
      where: { id },
    });

    if (!existingActivity) {
      throw new Error('Activity not found');
    }

    existingActivity.status = 'Done';
    return this.activityRepository.save(existingActivity);
  }
}
