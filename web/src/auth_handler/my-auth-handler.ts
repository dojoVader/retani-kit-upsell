import {
  AccessMode,
  ShopifyTokenExchangeAuthAfterHandler,
  ShopifyTokenExchangeAuthAfterHandlerParams,
  ShopifyTokenExchangeService,
} from '@nestjs-shopify/auth';
import { Session } from './../entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Shop } from 'src/entities/shop.entity';

@Injectable()
export class MyAuthHandler implements ShopifyTokenExchangeAuthAfterHandler {
  constructor(
    private readonly tokenExchangeService: ShopifyTokenExchangeService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
  ) {}

  async afterAuth({
    session,
    sessionToken,
  }: ShopifyTokenExchangeAuthAfterHandlerParams) {
    if (session.isOnline) {
      try {
        const offlineSession = await this.tokenExchangeService.exchangeToken(
          sessionToken,
          session.shop,
          AccessMode.Offline,
        );
        // Session Creation
        const sessionData = new Session();
        sessionData.id = offlineSession.id;
        sessionData.accessToken = offlineSession.accessToken ?? '';
        sessionData.scope = offlineSession.scope ?? '';

        // Shop Creation
        const shopData = new Shop();
        shopData.isActive = true;
        shopData.session = sessionData;
        shopData.shopDomain = session.shop;

        await this.sessionRepository.save(sessionData);
        await this.shopRepository.save(shopData);
      } catch (e) {
        console.log(e);
      }
    }
  }
}
