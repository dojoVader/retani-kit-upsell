import { useEffect, useRef, useState, type ReactNode } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { useAuthenticatedFetch } from "app/utils/useAuthenticatedFetch";
import redis from "../redis";

const SAVE_BAR_ID = "drawer-design-save-bar";

interface DrawerDesignSettings {
  drawerPosition: string;
  slotPosition: string;
  maxOffersShown: number;
  showProductImage: boolean;
  showStarRating: boolean;
  headingFont: string;
  accentColor: string;
  ctaButtonText: string;
}

const DEFAULT_DRAWER_DESIGN_SETTINGS: DrawerDesignSettings = {
  drawerPosition: "right",
  slotPosition: "below",
  maxOffersShown: 2,
  showProductImage: true,
  showStarRating: false,
  headingFont: "inherit",
  accentColor: "#2c6ecb",
  ctaButtonText: "Add to cart",
};

// Matches ShopSettingsSection.APPEARANCE in web/src/entities/types/shop-settings.types.ts
const APPEARANCE_SECTION = "appearance";

// Mirrors ShopSettingService#cacheKey in web/src/modules/shop-settings/services/shop-setting.service.ts
function drawerDesignCacheKey(shopDomain: string): string {
  return `shop:settings:${APPEARANCE_SECTION}_${shopDomain}`;
}

// Loads the drawer design settings for the shop resolved from the App Bridge session,
// reading straight from the same Redis cache the NestJS backend populates.
async function getDrawerDesignSettings(shopDomain: string): Promise<DrawerDesignSettings> {
  try {
    const cached = await redis.get(drawerDesignCacheKey(shopDomain));
    if (!cached) {
      return DEFAULT_DRAWER_DESIGN_SETTINGS;
    }

    const { value } = JSON.parse(cached) as { value: Partial<DrawerDesignSettings> };
    return { ...DEFAULT_DRAWER_DESIGN_SETTINGS, ...value };
  } catch {
    return DEFAULT_DRAWER_DESIGN_SETTINGS;
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await getDrawerDesignSettings(session.shop);

  return { settings };
};

function ProBadge() {
  return (
    <span
      style={{
        display: "inline-inline",
        background: "#ede9fe",
        color: "#6d28d9",
        fontSize: "12px",
        fontWeight: "600",
        padding: "2px 8px",
        borderRadius: "20px",
      }}
    >
      Pro
    </span>
  );
}

function Card({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e3e3e3",
        overflow: "hidden",
      }}
    >
      <div style={{ fontWeight: "600", fontSize: "15px", padding: "16px 24px 0" }}>
        {heading}
      </div>
      <div style={{ padding: "0 24px 8px" }}>{children}</div>
    </div>
  );
}

function SettingRow({
  title,
  description,
  control,
  disabled = false,
}: {
  title: string;
  description?: string;
  control: ReactNode;
  disabled?: boolean;
}) {
  return (
    <>
      <div style={{ height: "1px", background: "#e3e3e3", margin: "0 -24px" }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 0",
          gap: "16px",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <div>
          <div style={{ fontWeight: "600", fontSize: "14px", color: "#202223" }}>{title}</div>
          {description && (
            <div style={{ fontSize: "13px", color: "#6d7175", marginTop: "2px" }}>
              {description}
            </div>
          )}
        </div>
        <div style={{ flexShrink: 0 }}>{control}</div>
      </div>
    </>
  );
}

export default function DrawerDesignPage() {
  const { settings } = useLoaderData<typeof loader>();
  const shopifyFetch = useAuthenticatedFetch();

  const [drawerPosition, setDrawerPosition] = useState(settings.drawerPosition);
  const [upsellSlot, setUpsellSlot] = useState(settings.slotPosition);
  const [maxOffers, setMaxOffers] = useState(settings.maxOffersShown);
  const [showProductImage, setShowProductImage] = useState(settings.showProductImage);
  const [showStarRatings, setShowStarRatings] = useState(settings.showStarRating);

  const [headingFont, setHeadingFont] = useState(settings.headingFont);
  const [accentColor, setAccentColor] = useState(settings.accentColor);
  const [ctaText, setCtaText] = useState(settings.ctaButtonText);
  const [saving, setSaving] = useState(false);

  // Baseline used to detect unsaved changes and to restore on discard.
  const savedSettingsRef = useRef(settings);

  useEffect(() => {
    const saved = savedSettingsRef.current;
    const isDirty =
      drawerPosition !== saved.drawerPosition ||
      upsellSlot !== saved.slotPosition ||
      maxOffers !== saved.maxOffersShown ||
      showProductImage !== saved.showProductImage ||
      showStarRatings !== saved.showStarRating ||
      headingFont !== saved.headingFont ||
      accentColor !== saved.accentColor ||
      ctaText !== saved.ctaButtonText;

    if (isDirty) {
      void shopify.saveBar.show(SAVE_BAR_ID);
    } else {
      void shopify.saveBar.hide(SAVE_BAR_ID);
    }
  }, [
    drawerPosition,
    upsellSlot,
    maxOffers,
    showProductImage,
    showStarRatings,
    headingFont,
    accentColor,
    ctaText,
  ]);

  const handleDiscard = () => {
    const saved = savedSettingsRef.current;
    setDrawerPosition(saved.drawerPosition);
    setUpsellSlot(saved.slotPosition);
    setMaxOffers(saved.maxOffersShown);
    setShowProductImage(saved.showProductImage);
    setShowStarRatings(saved.showStarRating);
    setHeadingFont(saved.headingFont);
    setAccentColor(saved.accentColor);
    setCtaText(saved.ctaButtonText);
    void shopify.saveBar.hide(SAVE_BAR_ID);
  };

  const handleSave = async () => {
    const payload: DrawerDesignSettings = {
      drawerPosition,
      slotPosition: upsellSlot,
      maxOffersShown: maxOffers,
      showProductImage,
      showStarRating: showStarRatings,
      headingFont,
      accentColor,
      ctaButtonText: ctaText,
    };

    setSaving(true);
    try {
      await shopifyFetch("shop-settings/appearance", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      savedSettingsRef.current = payload;
      void shopify.saveBar.hide(SAVE_BAR_ID);
      shopify.toast.show("Drawer design settings saved");
    } catch {
      shopify.toast.show("Failed to save drawer design settings", { isError: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    // subheading is a valid s-page runtime prop; cast needed because polaris-types omits it
    <s-page
      {...({
        heading: "Drawer design",
        subheading: "Layout and branding for the cart drawer.",
      } as any)}
    >
      <ui-save-bar id={SAVE_BAR_ID} discardConfirmation>
        <button variant="primary" loading={saving} disabled={saving} onClick={handleSave}>
          Save
        </button>
        <button disabled={saving} onClick={handleDiscard}>
          Discard
        </button>
      </ui-save-bar>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Layout card */}
        <Card heading="Layout">
          <SettingRow
            title="Drawer position"
            control={
              <div style={{ width: "130px" }}>
                <s-select
                  label="Drawer position"
                  label-accessibility-visibility="hidden"
                  value={drawerPosition}
                  onChange={(e: any) => setDrawerPosition(e.target.value)}
                >
                  <s-option value="right">Right</s-option>
                  <s-option value="left">Left</s-option>
                </s-select>
              </div>
            }
          />
          <SettingRow
            title="Upsell slot"
            description="Where the offer sits"
            control={
              <div style={{ width: "180px" }}>
                <s-select
                  label="Upsell slot"
                  label-accessibility-visibility="hidden"
                  value={upsellSlot}
                  onChange={(e: any) => setUpsellSlot(e.target.value)}
                >
                  <s-option value="below">Below cart items</s-option>
                  <s-option value="above">Above cart items</s-option>
                  <s-option value="sticky">Sticky bottom</s-option>
                </s-select>
              </div>
            }
          />
          <SettingRow
            title="Max offers shown"
            description="Per drawer open"
            control={
              <div style={{ width: "80px" }}>
                <s-number-field
                  label="Max offers shown"
                  label-accessibility-visibility="hidden"
                  value={String(maxOffers)}
                  min={1}
                  max={5}
                  step={1}
                  onInput={(e: any) =>
                    setMaxOffers(
                      Math.min(5, Math.max(1, parseInt(e.target.value) || 1))
                    )
                  }
                />
              </div>
            }
          />
          <SettingRow
            title="Show product image"
            control={
              <s-switch
                label="Show product image"
                label-accessibility-visibility="hidden"
                checked={showProductImage}
                onChange={(e: any) => setShowProductImage(e.target.checked)}
              />
            }
          />
          <SettingRow
            title="Show star ratings"
            control={
              <s-switch
                label="Show star ratings"
                label-accessibility-visibility="hidden"
                checked={showStarRatings}
                onChange={(e: any) => setShowStarRatings(e.target.checked)}
              />
            }
          />
          <div style={{ height: "8px" }} />
        </Card>

        {/* Branding card */}
        <Card heading="Branding">
          <SettingRow
            title="Heading font"
            control={
              <div style={{ width: "160px" }}>
                <s-select
                  label="Heading font"
                  label-accessibility-visibility="hidden"
                  value={headingFont}
                  onChange={(e: any) => setHeadingFont(e.target.value)}
                >
                  <s-option value="inherit">Inherit theme</s-option>
                  <s-option value="sans">Sans-serif</s-option>
                  <s-option value="serif">Serif</s-option>
                  <s-option value="mono">Monospace</s-option>
                </s-select>
              </div>
            }
          />
          <SettingRow
            title="Accent color"
            description="CTA & progress bar"
            control={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #e3e3e3",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  background: "#fff",
                }}
              >
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  style={{
                    width: "24px",
                    height: "24px",
                    border: "none",
                    padding: "0",
                    cursor: "pointer",
                    borderRadius: "4px",
                    background: "transparent",
                  }}
                />
                <span style={{ fontSize: "13px", fontFamily: "monospace" }}>
                  {accentColor}
                </span>
              </div>
            }
          />
          <SettingRow
            title="CTA button text"
            control={
              <div style={{ width: "160px" }}>
                <s-text-field
                  label="CTA button text"
                  label-accessibility-visibility="hidden"
                  value={ctaText}
                  onInput={(e: any) => setCtaText(e.target.value)}
                />
              </div>
            }
          />
          <SettingRow
            title="Remove app branding"
            description={
              <>
                Available on Pro{" "}
                <ProBadge />
              </> as any
            }
            disabled
            control={
              <s-switch
                label="Remove app branding"
                label-accessibility-visibility="hidden"
                checked={false}
                disabled
              />
            }
          />
          <div style={{ height: "8px" }} />
        </Card>
      </div>
    </s-page>
  );
}
