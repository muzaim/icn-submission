import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('activity')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama: string;

  @Column()
  deskripsi: string;

  @Column()
  tanggal: Date;

  @Column()
  priority: string;

  @Column({ default: 'On Progress' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: true })
  is_active: boolean;

  @DeleteDateColumn({ type: 'timestamp', select: false })
  deleted_at?: Date;

  @Column({ default: null })
  user_id: number;
  
}
