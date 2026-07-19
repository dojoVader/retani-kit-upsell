import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpsellRule } from '../../../entities/upsell-rule.entity';
import { Repository } from 'typeorm';
import { Session } from '@shopify/shopify-api';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';


@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(UpsellRule)
    private readonly upsellRepository: Repository<UpsellRule>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}


  /**
   * Saves the Upsell rule to the Database for the store
   * @param upsellRule
   * @param session
   */
  async addRule(upsellRule: UpsellRule, session: Session) {
    await this.deleteCache(session.shop);
    return await this.upsellRepository.save(upsellRule);
  }
  async getRules(session: Session) {
    const results =  await this.upsellRepository.find({
      where: {
        session: {
          id: session.id,
        },
      },
    });
    await this.cacheStore(session.shop, results);
    return results;
  }

  private async deleteCache(shopId: string) {
    await this.cacheManager.del(`session:store:settings_${shopId}`);
  }

  async cacheStore(shopId: string, data: UpsellRule | UpsellRule[]) {
    await this.cacheManager.set(`session:store:settings_${shopId}`, data);
  }
}
