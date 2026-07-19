import { Module } from '@nestjs/common';
import { RulesController } from './controller/rules.controller';
import { RuleService } from './services/rule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpsellRule } from './../../entities/upsell-rule.entity';
import { SessionService } from './services/session.service';
import { Session } from 'src/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UpsellRule, Session])],
  controllers: [RulesController],
  providers: [RuleService, SessionService],
})
export class RulesModule {}
