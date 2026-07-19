import {
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UpsellRule } from './upsell-rule.entity';

@Entity('upsell_attributions')
@Index(['cartToken']) // webhook handler join — must be fast
@Index(['shopId', 'converted']) // dashboard revenue queries
@Index(['ruleId']) // per-rule breakdown queries
export class UpsellAttribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shopId: string;

  @Column()
  ruleId: string;

  @Column()
  cartToken: string; // links click event to Shopify order

  @Column({ nullable: true })
  orderId: string; // null until order/paid webhook confirms

  @Column()
  productId: string; // Shopify product GID

  @Column()
  variantId: string; // Shopify variant GID

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number; // price at time of click — not order price

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  revenue: number; // null until confirmed — unitPrice × qty

  @Column({ default: false })
  converted: boolean; // true only when order/paid webhook confirms

  @CreateDateColumn()
  addedAt: Date; // when customer clicked Add in drawer

  @Column({ nullable: true })
  convertedAt: Date; // when order confirmed — null if abandoned

  @ManyToOne(() => UpsellRule, (rule) => rule.attributions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ruleId' })
  rule: UpsellRule;
}
