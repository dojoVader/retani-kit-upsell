import { Module } from '@nestjs/common';
import { MyAuthHandler } from './my-auth-handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from 'src/entities/shop.entity';
import { Session } from 'src/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Shop])],
  providers: [MyAuthHandler],
  exports: [MyAuthHandler],
})
export class AuthHandlerModule {}
