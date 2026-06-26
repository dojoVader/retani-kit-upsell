// src/session/session.entity.ts
import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Shop } from './shop.entity';

@Entity('sessions')
export class Session {
  @PrimaryColumn()
  id: string; // Shopify session ID

  @Column()
  accessToken: string;

  @Column()
  scope: string;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date | null;

  @OneToOne(() => Shop, (shop) => shop.session)
  @JoinColumn({ name: 'shop_domain', referencedColumnName: 'shopDomain' })
  shop: Shop;
}
