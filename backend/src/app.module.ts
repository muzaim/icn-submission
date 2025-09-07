import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user/user.module';
import databaseConfig from './database/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { ProdukModule } from './produk/produk.module';
import { ActivityModule } from './activity/activity.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
    AuthModule,
    ActivityLogModule,
    ProdukModule,
    ActivityModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Folder untuk akses file
      serveRoot: '/uploads', // Prefix URL
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
