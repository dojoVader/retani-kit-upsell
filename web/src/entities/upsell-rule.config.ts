// ─────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────

export enum RuleType {
  THRESHOLD = 'threshold',
  PRODUCT = 'product',
  BUNDLE = 'bundle',
  LAST_CHANCE = 'lastchance',
  SEGMENT = 'segment',
  RETURNING = 'returning',
}

export enum CooldownType {
  SESSION = 'session',
  ONE_DAY = '1d',
  THREE_DAYS = '3d',
  NEVER = 'never',
}

export enum DiscountType {
  NONE = 'none',
  PCT = 'pct',
  FIXED = 'fixed',
}

export enum SlotPosition {
  BELOW_ITEMS = 'belowItems',
  ABOVE_CHECKOUT = 'aboveCheckout',
}

export enum TriggerMoment {
  ON_CART_OPEN = 'onCartOpen',
  ON_ADD_TO_CART = 'onAddToCart',
}

export enum ProductTriggerType {
  PRODUCT = 'product',
  COLLECTION = 'collection',
  TAG = 'tag',
  ANY = 'any',
}

export enum RecommendationSource {
  MANUAL = 'manual',
  SHOPIFY = 'shopify',
  COOCCURRENCE = 'cooccurrence',
  NEW_SINCE_LAST = 'new_since_last',
}

export enum BundleDiscount {
  NONE = 'none',
  PCT_OFF_BUNDLE = 'pct_off_bundle',
  FIXED_OFF_TOTAL = 'fixed_off_total',
}

// ─────────────────────────────────────────────
// Per-type config interfaces
// Each type stores only its own relevant fields
// All live in the jsonb `config` column
// ─────────────────────────────────────────────

export interface ThresholdConfig {
  // Trigger
  threshold: number; // required — cart subtotal must reach this value (£) to fire
  triggerMoment: TriggerMoment; // optional — default onCartOpen
  excludeCollections: string[]; // optional — never fire if cart contains these collections
  showProgressBar: boolean; // optional — default true; visual bar showing distance to target
  completionMessage: string; // optional — shown when threshold is reached

  // Offer
  productSelection: string; // required — how to pick the offer product (cheapest | most-expensive | manual)
  offerProductId?: string; // required when productSelection = manual
  headline: string; // optional — supports {gap} token, resolves to £ remaining
  discountType: DiscountType; // optional — default none
  discountValue: number; // optional — percent or fixed amount depending on discountType
  priority: number; // optional — higher value wins conflict resolution against other rules
  cooldown: CooldownType; // optional — default session
  abTest: boolean; // Pro only — default false

  // Appearance
  ctaButtonText: string; // optional — default '+ Add'
  slotPosition: SlotPosition; // optional — default belowItems
  showProductImage: boolean; // optional — default true
  showStarRatings: boolean; // Pro only — default false
}

export interface ProductConfig {
  // Trigger
  triggerType: ProductTriggerType; // required
  triggerProductId?: string; // required when triggerType = product
  triggerCollectionId?: string; // required when triggerType = collection
  triggerTag?: string; // required when triggerType = tag
  minQty: number; // optional — default 1
  excludeIfOfferInCart: boolean; // optional — default true
  excludeCollections: string[]; // optional

  // Offer
  recommendationSource: RecommendationSource; // required
  offerProductId?: string; // required when source = manual
  headline: string; // optional
  discountType: DiscountType; // optional
  discountValue: number; // optional
  showRating: boolean; // optional — default false
  oneClickAdd: boolean; // optional — default true
  slotPosition: SlotPosition; // optional — default belowItems
}

export interface BundleConfig {
  // Trigger
  sourceCollection: string; // required — products from this collection trigger
  excludeIfBundleInCart: boolean; // optional — default true
  minCartValue?: number; // optional — only fire above this subtotal

  // Offer
  recommendationSource: // required
    | RecommendationSource.COOCCURRENCE
    | RecommendationSource.SHOPIFY
    | RecommendationSource.MANUAL;
  maxBundleItems: number; // optional — default 2, max 4
  bundleDiscount: BundleDiscount; // optional — default none
  bundleDiscountValue: number; // optional — 0 when bundleDiscount = none
  showCompleteTheSetLabel: boolean; // optional — default true
}

export interface LastChanceConfig {
  // Trigger
  minCartValue: number; // required — only fire above this
  firesOn: 'checkoutClick'; // always fixed — cannot be changed by merchant
  oncePerSession: boolean; // optional — default true

  // Offer
  offerProductId: string; // required — product shown in modal
  headline: string; // optional
  discountType: DiscountType; // optional
  discountValue: number; // optional
  ctaButtonText: string; // optional — default 'Add and checkout'
  countdownTimer: boolean; // Pro only — default false
}

export interface SegmentConfig {
  // Trigger
  requiredTag: string; // required — Shopify customer tag
  requiresLogin: true; // always true — hardcoded, not editable
  newCustomersOnly: boolean; // optional — exclude returning buyers
  excludeCollections: string[]; // optional

  // Offer
  offerProductId: string; // required
  headline: string; // optional
  discountType: DiscountType; // optional
  discountValue: number; // optional
  oneClickAdd: boolean; // optional — default true
  slotPosition: SlotPosition; // optional
}

export interface ReturningConfig {
  // Trigger
  minPastOrders: number; // required — customer must have at least N orders
  requiresLogin: true; // always true — hardcoded
  excludeAlreadyPurchased: boolean; // optional — suppress if customer owns offer
  maxDaysSinceLastOrder?: number; // optional — unique to this type only

  // Offer
  recommendationSource:
    | RecommendationSource.NEW_SINCE_LAST
    | RecommendationSource.COOCCURRENCE
    | RecommendationSource.MANUAL; // required
  offerProductId?: string; // required when source = manual
  headline: string; // optional
  discountType: DiscountType; // optional
  discountValue: number; // optional
  oneClickAdd: boolean; // optional
}

// Discriminated union — narrows config type based on ruleType field
export type RuleConfig =
  | ({ ruleType: RuleType.THRESHOLD } & ThresholdConfig)
  | ({ ruleType: RuleType.PRODUCT } & ProductConfig)
  | ({ ruleType: RuleType.BUNDLE } & BundleConfig)
  | ({ ruleType: RuleType.LAST_CHANCE } & LastChanceConfig)
  | ({ ruleType: RuleType.SEGMENT } & SegmentConfig)
  | ({ ruleType: RuleType.RETURNING } & ReturningConfig);

// ─────────────────────────────────────────────
// Config validators — one per rule type
// Called by @BeforeInsert and @BeforeUpdate hooks
// Throws BadRequestException if shape is invalid
// ─────────────────────────────────────────────

export const ConfigValidators: Record<
  RuleType,
  (config: RuleConfig) => string[]
> = {
  [RuleType.THRESHOLD]: (c) => {
    const cfg = c as ThresholdConfig;
    const errors: string[] = [];
    if (!cfg.threshold || cfg.threshold <= 0)
      errors.push('threshold must be a positive number');
    if (cfg.productSelection === 'specific' && !cfg.offerProductId)
      errors.push(
        'offerProductId is required when productSelection is specific',
      );
    return errors;
  },

  [RuleType.PRODUCT]: (c) => {
    const cfg = c as ProductConfig;
    const errors: string[] = [];
    if (!cfg.triggerType) errors.push('triggerType is required');
    if (cfg.triggerType === 'product' && !cfg.triggerProductId)
      errors.push('triggerProductId is required when triggerType is product');
    if (cfg.triggerType === 'collection' && !cfg.triggerCollectionId)
      errors.push(
        'triggerCollectionId is required when triggerType is collection',
      );
    if (cfg.triggerType === 'tag' && !cfg.triggerTag)
      errors.push('triggerTag is required when triggerType is tag');
    if (
      cfg.recommendationSource === RecommendationSource.MANUAL &&
      !cfg.offerProductId
    )
      errors.push(
        'offerProductId is required when recommendationSource is manual',
      );
    return errors;
  },

  [RuleType.BUNDLE]: (c) => {
    const cfg = c as BundleConfig;
    const errors: string[] = [];
    if (!cfg.sourceCollection) errors.push('sourceCollection is required');
    if (!cfg.recommendationSource)
      errors.push('recommendationSource is required');
    if (cfg.maxBundleItems > 4) errors.push('maxBundleItems cannot exceed 4');
    return errors;
  },

  [RuleType.LAST_CHANCE]: (c) => {
    const cfg = c as LastChanceConfig;
    const errors: string[] = [];
    if (!cfg.minCartValue || cfg.minCartValue < 0)
      errors.push('minCartValue must be a non-negative number');
    if (!cfg.offerProductId)
      errors.push('offerProductId is required for last chance rules');
    if (cfg.firesOn !== 'checkoutClick')
      errors.push(
        'firesOn must be checkoutClick — this field cannot be changed',
      );
    return errors;
  },

  [RuleType.SEGMENT]: (c) => {
    const cfg = c as SegmentConfig;
    const errors: string[] = [];
    if (!cfg.requiredTag) errors.push('requiredTag is required');
    if (!cfg.offerProductId)
      errors.push('offerProductId is required for segment rules');
    if (cfg.requiresLogin !== true)
      errors.push('requiresLogin must always be true for segment rules');
    return errors;
  },

  [RuleType.RETURNING]: (c) => {
    const cfg = c as ReturningConfig;
    const errors: string[] = [];
    if (!cfg.minPastOrders || cfg.minPastOrders < 1)
      errors.push('minPastOrders must be at least 1');
    if (cfg.requiresLogin !== true)
      errors.push(
        'requiresLogin must always be true for returning buyer rules',
      );
    if (
      cfg.recommendationSource === RecommendationSource.MANUAL &&
      !cfg.offerProductId
    )
      errors.push(
        'offerProductId is required when recommendationSource is manual',
      );
    return errors;
  },
};

// ─────────────────────────────────────────────
// Default config per rule type
// Applied when optional fields are omitted
// ─────────────────────────────────────────────

export const ConfigDefaults: Record<RuleType, Partial<RuleConfig>> = {
  [RuleType.THRESHOLD]: {
    triggerMoment: TriggerMoment.ON_CART_OPEN,
    excludeCollections: [],
    productSelection: 'cheapest',
    headline: "You're £{gap} away from free shipping!",
    showProgressBar: true,
    completionMessage: "You've unlocked free shipping!",
    discountType: DiscountType.NONE,
    discountValue: 0,
  } as Partial<ThresholdConfig>,

  [RuleType.PRODUCT]: {
    minQty: 1,
    excludeIfOfferInCart: true,
    excludeCollections: [],
    recommendationSource: RecommendationSource.MANUAL,
    headline: 'Pairs perfectly with this',
    discountType: DiscountType.NONE,
    discountValue: 0,
    showRating: false,
    oneClickAdd: true,
    slotPosition: SlotPosition.BELOW_ITEMS,
  } as Partial<ProductConfig>,

  [RuleType.BUNDLE]: {
    excludeIfBundleInCart: true,
    recommendationSource: RecommendationSource.COOCCURRENCE,
    maxBundleItems: 2,
    bundleDiscount: BundleDiscount.NONE,
    bundleDiscountValue: 0,
    showCompleteTheSetLabel: true,
  } as Partial<BundleConfig>,

  [RuleType.LAST_CHANCE]: {
    firesOn: 'checkoutClick',
    oncePerSession: true,
    headline: 'Wait — one last thing!',
    discountType: DiscountType.PCT,
    discountValue: 15,
    ctaButtonText: 'Add and checkout',
    countdownTimer: false,
  } as Partial<LastChanceConfig>,

  [RuleType.SEGMENT]: {
    requiresLogin: true,
    newCustomersOnly: false,
    excludeCollections: [],
    headline: 'Exclusive for you',
    discountType: DiscountType.NONE,
    discountValue: 0,
    oneClickAdd: true,
    slotPosition: SlotPosition.BELOW_ITEMS,
  } as Partial<SegmentConfig>,

  [RuleType.RETURNING]: {
    requiresLogin: true,
    excludeAlreadyPurchased: true,
    recommendationSource: RecommendationSource.NEW_SINCE_LAST,
    headline: 'New since your last visit',
    discountType: DiscountType.NONE,
    discountValue: 0,
    oneClickAdd: true,
  } as Partial<ReturningConfig>,
};
