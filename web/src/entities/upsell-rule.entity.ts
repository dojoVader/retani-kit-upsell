import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Shop } from './shop.entity';
import { UpsellProduct } from './upsell-product.entity';
import { RuleEvent } from './rule-event.entity';
import type {
  DiscountType,
  Placement,
  RecommendationConfig,
  RecommendationType,
  TriggerConfig,
  TriggerType,
} from './types/upsell-rule.types';

@Entity('upsell_rules')
@Index(['shop', 'active'])
@Index(['shop', 'priority'])
export class UpsellRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  triggerType: TriggerType;

  @Column({ type: 'jsonb', default: '{}' })
  triggerConfig: TriggerConfig;

  @Column()
  recommendationType: RecommendationType;

  @Column({ type: 'jsonb', default: '{"limit":3}' })
  recommendationConfig: RecommendationConfig;

  @Column({ default: 'none' })
  discountType: DiscountType;

  @Column({ type: 'float', default: 0 })
  discountValue: number;

  @Column({ default: 'bottom' })
  placement: Placement;

  @Column({ default: 0 })
  priority: number; // lower = fires first

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  startsAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  endsAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Shop, (shop) => shop.upsellRules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_domain', referencedColumnName: 'shopDomain' })
  shop: Shop;

  @OneToMany(() => UpsellProduct, (product) => product.rule, { cascade: true })
  upsellProducts: UpsellProduct[];

  @OneToMany(() => RuleEvent, (event) => event.rule)
  ruleEvents: RuleEvent[];
}
