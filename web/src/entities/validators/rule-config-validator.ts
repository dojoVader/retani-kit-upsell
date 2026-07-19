import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ConfigValidators, type RuleConfig } from '../upsell-rule.config';
import { UpSellRuleRequest } from '../dto/upsell-rule-dto';

@ValidatorConstraint({ name: 'isValidRuleConfig', async: false })
export class RuleConfigValidator implements ValidatorConstraintInterface {
  private errors: string[] = [];

  validate(config: RuleConfig, args: ValidationArguments) {
    const { type } = args.object as UpSellRuleRequest;
    const validator = ConfigValidators[type];
    if (!validator) {
      this.errors = [`Unknown rule type: ${type}`];
      return false;
    }
    this.errors = validator(config);
    return this.errors.length === 0;
  }

  defaultMessage(args: ValidationArguments) {
    const { type } = args.object as UpSellRuleRequest;
    return `Invalid config for ${type} rule: ${this.errors.join(', ')}`;
  }
}
