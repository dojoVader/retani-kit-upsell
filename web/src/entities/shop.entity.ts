// src/shop/shop.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Session } from './session.entity';
import { DrawerConfig } from './drawer-config.entity';
import { UpsellRule } from './upsell-rule.entity';
import { RuleEvent } from './rule-event.entity';

@Entity('shops')
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  shopDomain: string;

  @Column({ default: 'free' })
  plan: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  installedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Session, (session) => session.shop, { cascade: true })
  session: Session;

  @OneToOne(() => DrawerConfig, (config) => config.shop, { cascade: true })
  drawerConfig: DrawerConfig;

  @OneToMany(() => UpsellRule, (rule) => rule.shop)
  upsellRules: UpsellRule[];

  @OneToMany(() => RuleEvent, (event) => event.shop)
  ruleEvents: RuleEvent[];
}
