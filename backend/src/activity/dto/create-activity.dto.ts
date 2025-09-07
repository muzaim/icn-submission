import { IsString, IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  deskripsi: string;

  @IsDate()
  tanggal: Date;

  @IsString()
  priority: string;
}
