export interface AppearanceSettings {
  drawerPosition:   'left' | 'right';
  slotPosition:     'belowItems' | 'aboveCheckout' | 'stickyFooter';
  maxOffersShown:   number;
  showProductImage: boolean;
  showStarRating:   boolean;
  accentColor:      string;
  headingFont:      'inheritTheme' | 'systemUI';
  ctaButtonText:    string;
  removeBranding:   boolean;   // Pro only
}

export interface BehaviourSettings {
  openOnAddToCart:      boolean;
  interceptCartPage:    boolean;
  showProgressBar:      boolean;
  freeShippingThreshold?: number;
  conflictMode:         'priority' | 'discount' | 'stacked' | 'hierarchy';
  maxStackedOffers:     number;
  cooldownSessions:     number;
  dismissRemembered:    boolean;
  abTestingMode:        boolean;  // Pro only
}

export interface OfferSettings {
  autoApplyDiscount:       boolean;
  showPriceComparison:     boolean;
  allowDiscountStacking:   boolean;
  showCountdownTimer:      boolean;  // Pro only
}

export interface PlanSettings {
  plan:            'free' | 'pro';
  billingInterval: 'monthly' | 'annual';
  trialEndsAt?:    string;
  chargeId?:       string;       // Shopify billing charge ID
}

export interface TargetSettings{
  // --- Audience Settings ---
  customerSegment: string;
  showToNewVisitors: boolean;
  showToReturningBuyers: boolean;

  // --- Placement Settings ---
  mobileDevicesEnabled: boolean;
  countries: string | string[];
  minimumItemsInCart: number;
}

export interface FreeShippingSettings {
  /** Controls visibility at the top of the cart drawer */
  showFreeShippingBar: boolean;

  /** Minimum cart total required to qualify for free shipping */
  thresholdAmount: number;

  /** Banner text displayed when the cart total is below the threshold. Supports {amount} placeholder. */
  belowThresholdMessage: string;

  /** Banner text displayed once the free shipping threshold has been met or exceeded */
  atThresholdMessage: string;
}
