import { IsDefined, IsEnum, ValidateNested } from 'class-validator';
import * as upsellRuleConfig from '../upsell-rule.config';
import { Type } from 'class-transformer';

export class UpSellRuleRequest {
  @IsEnum(upsellRuleConfig.RuleType)
  type: upsellRuleConfig.RuleType;

  // jsonb — shape depends on `type`, narrowed via the discriminated RuleConfig
  // union. Re-uses the same per-type validators the entity runs in its
  // @BeforeInsert/@BeforeUpdate hooks so both layers stay in sync.
  @IsDefined()
  @ValidateNested()
  @Type(() => Object)
  config: upsellRuleConfig.RuleConfig;
}
