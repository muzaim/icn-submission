export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}
export class CreateUserDto {
  email: string;
  password: string;
  fullname: string;
}
