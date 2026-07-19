import {
  AccessMode,
  CurrentSession,
  UseShopifyAuth,
} from '@nestjs-shopify/auth';
import { Body, Controller, Get, Param, ParseEnumPipe, Post } from '@nestjs/common';
import { Session } from '@shopify/shopify-api';
import { ShopSettingService } from '../services/shop-setting.service';
import { ShopSettingsSection } from '../../../entities/types/shop-settings.types';

@UseShopifyAuth(AccessMode.Offline)
@Controller('shop-settings')
export class ShopSettingsController {
  constructor(private readonly shopSettingService: ShopSettingService) {}

  @Get()
  async fetch(@CurrentSession() session: Session) {
    return {
      data: await this.shopSettingService.getSettings(session),
    };
  }

  @Get(':section')
  async fetchSection(
    @CurrentSession() session: Session,
    @Param('section', new ParseEnumPipe(ShopSettingsSection))
    section: ShopSettingsSection,
  ) {
    return {
      data: await this.shopSettingService.getSection(session, section),
    };
  }

  @Post(':section')
  async save(
    @CurrentSession() session: Session,
    @Param('section', new ParseEnumPipe(ShopSettingsSection))
    section: ShopSettingsSection,
    @Body() data: Record<string, unknown>,
  ) {
    const settings = await this.shopSettingService.updateSection(
      session,
      section,
      data,
    );
    return {
      message: 'Shop settings updated',
      data: settings[section],
    };
  }
}
