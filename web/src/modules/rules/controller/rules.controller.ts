import {
  AccessMode,
  CurrentSession,
  UseShopifyAuth,
} from '@nestjs-shopify/auth';
import { Controller, Post, Body, Get } from '@nestjs/common';
import { Session } from '@shopify/shopify-api';
import { RuleService } from '../services/rule.service';
import { UpSellRuleRequest } from '../../../entities/dto/upsell-rule-dto';
import { SessionService } from '../services/session.service';
import { UpsellRule } from 'src/entities/upsell-rule.entity';
import { Session as SessionEntity } from 'src/entities/session.entity';

@UseShopifyAuth(AccessMode.Offline)
@Controller('rules')
export class RulesController {
  constructor(
    private readonly ruleService: RuleService,
    private readonly sessionService: SessionService,
  ) { }

  @Get('/settings')
  async fetch(@CurrentSession() session: Session) {
    return {
      data: await this.ruleService.getRules(session),
    };
  }

  @Post('/settings')
  async save(
    @CurrentSession() session: Session,

    @Body() rules: UpSellRuleRequest,
  ) {
    const sessionData = await this.sessionService.getSessionById(session.id);
    // Setup the Upsell
    const upsell = new UpsellRule();
    upsell.session = sessionData;
    upsell.type = rules.type;
    upsell.config = rules.config as any;
    const result = await this.ruleService.addRule(upsell, session);
    if (result) {
      return {
        message: 'Upsell rule added',
        data: {
          type: rules.type,
          shop: {
            sessionId: session.id,
          },
        },
      };
    }
  }
}
