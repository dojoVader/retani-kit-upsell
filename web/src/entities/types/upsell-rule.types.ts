// src/upsell-rules/types/upsell-rule.types.ts

export type TriggerType =
  | 'any'
  | 'product_sku'
  | 'collection'
  | 'cart_threshold';

export type TriggerConfig =
  | Record<string, never> // any
  | { skus: string[] } // product_sku
  | { collectionIds: string[] } // collection
  | { minValue: number; maxValue?: number }; // cart_threshold

export type RecommendationType =
  | 'manual'
  | 'bought_together'
  | 'same_collection';

export type RecommendationConfig = {
  limit: number;
};

export type DiscountType = 'none' | 'percent' | 'fixed';
export type Placement = 'top' | 'bottom' | 'after_item';
