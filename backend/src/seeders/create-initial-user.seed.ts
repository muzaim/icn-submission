import { DataSource } from 'typeorm';
import { User } from '../user/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}
export const seedInitialUser = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);

  const user = new User();
  user.email = 'admin@example.com';
  user.password = await bcrypt.hash(123123, 10);

  await userRepository.save(user);
};
