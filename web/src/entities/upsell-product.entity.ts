// src/upsell-rules/upsell-product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { UpsellRule } from './upsell-rule.entity';

@Entity('upsell_products')
@Index(['rule'])
export class UpsellProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shopifyProductId: string;

  @Column({ type: 'varchar', length: 255 })
  shopifyVariantId: string | null;

  @Column({ default: 0 })
  displayOrder: number;

  @ManyToOne(() => UpsellRule, (rule) => rule.upsellProducts, {
    onDelete: 'CASCADE',
  })
  rule: UpsellRule;
}
