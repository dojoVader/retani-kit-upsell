import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopSettingsController } from './controller/shop-settings.controller';
import { ShopSettingService } from './services/shop-setting.service';
import { ShopSettings } from '../../entities/shop-settings.entity';
import { Shop } from '../../entities/shop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShopSettings, Shop])],
  controllers: [ShopSettingsController],
  providers: [ShopSettingService],
})
export class ShopSettingsModule {}
