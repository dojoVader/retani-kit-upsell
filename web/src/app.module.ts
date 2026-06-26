import '@shopify/shopify-api/adapters/node';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiVersion } from '@shopify/shopify-api';
import { ShopifyExpressModule } from '@nestjs-shopify/express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyv } from 'keyv';
import KeyvRedis from '@keyv/redis';
import { KeyvCacheableMemory } from 'cacheable';

import { MyRedisSessionStorage } from './services/my-redis-session-storage';
import { DrawerConfig } from './entities/drawer-config.entity';
import { RuleEvent } from './entities/rule-event.entity';
import { Session } from './entities/session.entity';
import { Shop } from './entities/shop.entity';
import { UpsellProduct } from './entities/upsell-product.entity';
import { UpsellRule } from './entities/upsell-rule.entity';

const entities = [
  DrawerConfig,
  RuleEvent,
  Session,
  Shop,
  UpsellProduct,
  UpsellRule,
];

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          stores: [
            new Keyv({
              store: new KeyvCacheableMemory({
                ttl: 6000,
                lruSize: 5000,
              }),
            }),
            new KeyvRedis('redis://localhost:6379'),
          ],
        };
      },
    }),
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({

      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.getOrThrow('DB_HOST') || 'localhost',
          port: Number(config.getOrThrow('DB_PORT')) || 5432,
          username: config.getOrThrow('DB_USER') || 'postgres',
          password: config.get('DB_PASSWORD') || 'Alpha.01$',
          database: config.get('DB_NAME') || 'upsell-kit-db',
          entities: [...entities],
          synchronize: true,
          logging: true,
          autoLoadEntities: true,
        };
      },
    }),
    ShopifyExpressModule.forRootAsync({
      provideInjectionTokensFrom: [MyRedisSessionStorage],
      imports: [ConfigModule],
      useFactory: (
        configService: ConfigService,
        sessionStorage: MyRedisSessionStorage,
      ) => {
        return {
          apiKey: configService.getOrThrow('SHOPIFY_API_KEY'),
          apiSecretKey: configService.getOrThrow('SHOPIFY_API_SECRET'),
          apiVersion: ApiVersion.Unstable,
          hostName: (configService.get('HOST') as string)?.replace(
            /https:\/\//,
            '',
          ),
          isEmbeddedApp: true,
          scopes: ['test_scope'],
          sessionStorage,
        };
      },

      inject: [ConfigService, MyRedisSessionStorage],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, MyRedisSessionStorage],
})
export class AppModule {}
