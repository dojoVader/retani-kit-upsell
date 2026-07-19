import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
} from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import {
  RuleType,
  CooldownType,
  ConfigValidators,
  ConfigDefaults,
} from './upsell-rule.config';
import type {
  RuleConfig,
  ThresholdConfig,
  ProductConfig,
  BundleConfig,
  LastChanceConfig,
  SegmentConfig,
  ReturningConfig,
} from './upsell-rule.config';
import { Session } from './session.entity';

// ─────────────────────────────────────────────
// UpsellRule Entity
// ─────────────────────────────────────────────

@Entity('upsell_rules')
export class UpsellRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Session, (session) => session.shop)
  @JoinColumn()
  session: unknown; // typed as Shop in full codebase

  // ── Core fields — shared across all rule types ──

  @Column({
    type: 'enum',
    enum: RuleType,
  })
  type: RuleType;

  @Column({ default: true })
  active: boolean;

  // ── Config column — type-specific fields ──
  // jsonb for Postgres: binary stored, indexable via GIN, queryable with -> operators
  // Validated in @BeforeInsert / @BeforeUpdate hooks below
  // Defaults applied in @BeforeInsert hook

  @Column({ type: 'jsonb' })
  config: RuleConfig;

  // ── Attribution relationship ──

  @OneToMany('UpsellAttribution', 'rule')
  attributions: unknown[];

  // ── Timestamps ──

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ─────────────────────────────────────────────
  // Lifecycle hooks
  // ─────────────────────────────────────────────

  @BeforeInsert()
  applyDefaultsAndValidate() {
    // 1. Merge defaults — only fills in fields not already set by merchant
    const defaults = ConfigDefaults[this.type] ?? {};
    this.config = { ...defaults, ...this.config };

    // 2. Enforce fields that must always be true regardless of input
    if (this.type === RuleType.SEGMENT || this.type === RuleType.RETURNING) {
      (this.config as SegmentConfig | ReturningConfig).requiresLogin = true;
    }

    if (this.type === RuleType.LAST_CHANCE) {
      (this.config as LastChanceConfig).firesOn = 'checkoutClick';
    }

    // 3. Validate config shape for this rule type
    this.validateConfig();

    // 4. Clamp priority to valid range
  }

  @BeforeUpdate()
  validateOnUpdate() {
    // Re-enforce locked fields on every update
    if (this.type === RuleType.SEGMENT || this.type === RuleType.RETURNING) {
      (this.config as SegmentConfig | ReturningConfig).requiresLogin = true;
    }

    if (this.type === RuleType.LAST_CHANCE) {
      (this.config as LastChanceConfig).firesOn = 'checkoutClick';
    }

    this.validateConfig();
  }

  private validateConfig() {
    const validator = ConfigValidators[this.type];
    if (!validator) {
      throw new BadRequestException(`Unknown rule type: ${this.type}`);
    }
    const errors = validator(this.config);
    if (errors.length > 0) {
      throw new BadRequestException(
        `Invalid config for ${this.type} rule: ${errors.join(', ')}`,
      );
    }
  }

  // ─────────────────────────────────────────────
  // Type-narrowing helpers
  // Used by the rule engine matchers — avoids
  // casting throughout the codebase
  // ─────────────────────────────────────────────

  isThreshold(): this is UpsellRule & { config: ThresholdConfig } {
    return this.type === RuleType.THRESHOLD;
  }

  isProduct(): this is UpsellRule & { config: ProductConfig } {
    return this.type === RuleType.PRODUCT;
  }

  isBundle(): this is UpsellRule & { config: BundleConfig } {
    return this.type === RuleType.BUNDLE;
  }

  isLastChance(): this is UpsellRule & { config: LastChanceConfig } {
    return this.type === RuleType.LAST_CHANCE;
  }



  isSegment(): this is UpsellRule & { config: SegmentConfig } {
    return this.type === RuleType.SEGMENT;
  }

  isReturning(): this is UpsellRule & { config: ReturningConfig } {
    return this.type === RuleType.RETURNING;
  }

  // ─────────────────────────────────────────────
  // Convenience getters
  // Used by conflict resolver and attribution
  // ─────────────────────────────────────────────

  get discountValue(): number {
    return (this.config as ThresholdConfig).discountValue ?? 0;
  }

  get offerProductId(): string | undefined {
    const cfg = this.config as
      | ThresholdConfig
      | ProductConfig
      | LastChanceConfig
      | SegmentConfig
      | ReturningConfig;
    return (cfg as { offerProductId?: string }).offerProductId;
  }

  get headline(): string {
    return (this.config as ThresholdConfig).headline ?? '';
  }

  get isLoginRequired(): boolean {
    return this.type === RuleType.SEGMENT || this.type === RuleType.RETURNING;
  }

  get firesOnCheckout(): boolean {
    return this.type === RuleType.LAST_CHANCE;
  }
}
