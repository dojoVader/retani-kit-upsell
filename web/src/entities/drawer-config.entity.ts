import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Shop } from './shop.entity';

@Entity('drawer_configs')
export class DrawerConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'right' })
  drawerPosition: string; // 'left' | 'right'

  @Column({ default: '#0C447C' })
  accentColor: string;

  @Column({ default: 'Your cart' })
  headerText: string;

  @Column({ default: 'Checkout' })
  checkoutButtonText: string;

  @Column({ default: true })
  showShippingBar: boolean;

  @Column({ type: 'float', default: 50.0 })
  shippingThreshold: number;

  @Column({ default: 'Spend {amount} more for free shipping' })
  belowThresholdMsg: string;

  @Column({ default: "You''ve unlocked free shipping!" })
  atThresholdMsg: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Shop, (shop) => shop.drawerConfig)
  @JoinColumn({ name: 'shop_domain', referencedColumnName: 'shopDomain' })
  shop: Shop;
}
