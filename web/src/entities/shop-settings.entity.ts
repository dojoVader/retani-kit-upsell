// shop-settings.entity.ts
import {Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Shop} from "./shop.entity";
import type {AppearanceSettings, BehaviourSettings, FreeShippingSettings, OfferSettings, PlanSettings, TargetSettings} from "./types/shop-settings.types";

@Entity('shop_settings')
export class ShopSettings {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  shopId: string;              // one row per shop — unique constraint enforces this

  // Each page's settings live in their own typed jsonb column
  // Separate columns = separate Redis cache keys per page
  // One column per page section — not one giant blob

  @Column({ type: 'jsonb', default: '{}' })
  appearance: AppearanceSettings;

  @Column({ type: 'jsonb', default: '{}' })
  behaviour: BehaviourSettings;

  @Column({ type: 'jsonb', default: '{}' })
  plan: PlanSettings;

  @Column({ type: 'jsonb', default: '{}' })
  target: TargetSettings;

  @Column({ type: 'jsonb', default: '{}' })
  freeShipping: FreeShippingSettings;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Shop)
  @JoinColumn({ name: 'shopId' })
  shop: Shop;
}
