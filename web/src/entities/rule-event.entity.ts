import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { UpsellRule } from './upsell-rule.entity';
import { Shop } from './shop.entity';

export type EventType = 'impression' | 'add_to_cart' | 'dismissed';

@Entity('rule_events')
@Index(['rule', 'eventType'])
@Index(['shop', 'createdAt'])
export class RuleEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventType: EventType;

  @Column({ type: 'varchar', length: 255 })
  shopifyCartToken: string | null;

  @Column({ type: 'varchar', length: 255 })
  productId: string | null;

  @Column({ type: 'float', nullable: true })
  cartValue: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UpsellRule, { onDelete: 'CASCADE' })
  rule: UpsellRule;

  @ManyToOne(() => Shop, (shop) => shop.ruleEvents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_domain', referencedColumnName: 'shopDomain' })
  shop: Shop;
}
