import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Session } from '@shopify/shopify-api';
import { ShopSettings } from '../../../entities/shop-settings.entity';
import { Shop } from '../../../entities/shop.entity';
import { ShopSettingsSection } from '../../../entities/types/shop-settings.types';

@Injectable()
export class ShopSettingService {
  constructor(
    @InjectRepository(ShopSettings)
    private readonly settingsRepository: Repository<ShopSettings>,
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Fetches every settings section for the current shop, creating the row
   * (with column defaults) on first access.
   */
  async getSettings(session: Session): Promise<ShopSettings> {
    return this.findOrCreate(session.shop);
  }

  /**
   * Fetches a single section, served from its own cache key so unrelated
   * sections don't invalidate each other.
   */
  async getSection<T extends ShopSettingsSection>(
    session: Session,
    section: T,
  ): Promise<ShopSettings[T]> {
    const cacheKey = this.cacheKey(session.shop, section);
    const cached = await this.cacheManager.get<ShopSettings[T]>(cacheKey);
    if (cached) {
      return cached;
    }

    const settings = await this.findOrCreate(session.shop);
    await this.cacheManager.set(cacheKey, settings[section]);
    return settings[section];
  }

  /**
   * Merges `data` into the given section and persists it.
   */
  async updateSection<T extends ShopSettingsSection>(
    session: Session,
    section: T,
    data: Partial<ShopSettings[T]>,
  ): Promise<ShopSettings> {
    const settings = await this.findOrCreate(session.shop);
    settings[section] = { ...settings[section], ...data } as ShopSettings[T];

    const saved = await this.settingsRepository.save(settings);
    await this.cacheManager.set(
      this.cacheKey(session.shop, section),
      saved[section],
    );
    return saved;
  }

  private async findOrCreate(shopDomain: string): Promise<ShopSettings> {
    const shop = await this.shopRepository.findOneBy({
      shopDomain,
    });
    if (!shop) {
      throw new NotFoundException(`Shop not found: ${shopDomain}`);
    }

    const existing = await this.settingsRepository.findOne({
      where: { shopId: shop.id },
    });
    if (existing) {
      return existing;
    }

    const created = this.settingsRepository.create({ shopId: shop.id });
    return this.settingsRepository.save(created);
  }

  private cacheKey(shopDomain: string, section: ShopSettingsSection): string {
    return `shop:settings:${section}_${shopDomain}`;
  }
}
