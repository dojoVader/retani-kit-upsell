import { useEffect, useRef, useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { useAuthenticatedFetch } from "app/utils/useAuthenticatedFetch";
import redis from "../redis";

const PREVIEW_CART_AMOUNT = 36.0;
const SAVE_BAR_ID = "free-shipping-settings-save-bar";

interface FreeShippingSettings {
  showFreeShippingBar: boolean;
  thresholdAmount: number;
  belowThresholdMessage: string;
  atThresholdMessage: string;
}

const DEFAULT_FREE_SHIPPING_SETTINGS: FreeShippingSettings = {
  showFreeShippingBar: true,
  thresholdAmount: 50,
  belowThresholdMessage: "Spend {amount} more for free shipping",
  atThresholdMessage: "You've unlocked free shipping",
};

// Matches ShopSettingsSection.FREE_SHIPPING in web/src/entities/types/shop-settings.types.ts
const FREE_SHIPPING_SECTION = "freeShipping";

// Mirrors ShopSettingService#cacheKey in web/src/modules/shop-settings/services/shop-setting.service.ts
function freeShippingCacheKey(shopDomain: string): string {
  return `shop:settings:${FREE_SHIPPING_SECTION}_${shopDomain}`;
}

// Loads the free shipping settings for the shop resolved from the App Bridge session,
// reading straight from the same Redis cache the NestJS backend populates.
async function getFreeShippingSettings(shopDomain: string): Promise<FreeShippingSettings> {
  try {
    const cached = await redis.get(freeShippingCacheKey(shopDomain));
    if (!cached) {
      return DEFAULT_FREE_SHIPPING_SETTINGS;
    }

    const { value } = JSON.parse(cached) as { value: Partial<FreeShippingSettings> };
    return { ...DEFAULT_FREE_SHIPPING_SETTINGS, ...value };
  } catch {
    return DEFAULT_FREE_SHIPPING_SETTINGS;
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await getFreeShippingSettings(session.shop);

  return { settings };
};

export default function FreeShippingPage() {
  const { settings } = useLoaderData<typeof loader>();
  const shopifyFetch = useAuthenticatedFetch();

  const [showBar, setShowBar] = useState(settings.showFreeShippingBar);
  const [threshold, setThreshold] = useState(settings.thresholdAmount);
  const [belowMessage, setBelowMessage] = useState(settings.belowThresholdMessage);
  const [atMessage, setAtMessage] = useState(settings.atThresholdMessage);
  const [saving, setSaving] = useState(false);

  // Baseline used to detect unsaved changes and to restore on discard.
  const savedSettingsRef = useRef(settings);

  useEffect(() => {
    const saved = savedSettingsRef.current;
    const isDirty =
      showBar !== saved.showFreeShippingBar ||
      threshold !== saved.thresholdAmount ||
      belowMessage !== saved.belowThresholdMessage ||
      atMessage !== saved.atThresholdMessage;

    if (isDirty) {
      void shopify.saveBar.show(SAVE_BAR_ID);
    } else {
      void shopify.saveBar.hide(SAVE_BAR_ID);
    }
  }, [showBar, threshold, belowMessage, atMessage]);

  const handleDiscard = () => {
    const saved = savedSettingsRef.current;
    setShowBar(saved.showFreeShippingBar);
    setThreshold(saved.thresholdAmount);
    setBelowMessage(saved.belowThresholdMessage);
    setAtMessage(saved.atThresholdMessage);
    void shopify.saveBar.hide(SAVE_BAR_ID);
  };

  const handleSave = async () => {
    const payload: FreeShippingSettings = {
      showFreeShippingBar: showBar,
      thresholdAmount: threshold,
      belowThresholdMessage: belowMessage,
      atThresholdMessage: atMessage,
    };

    setSaving(true);
    try {
      await shopifyFetch("shop-settings/freeShipping", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      savedSettingsRef.current = payload;
      void shopify.saveBar.hide(SAVE_BAR_ID);
      shopify.toast.show("Free shipping settings saved");
    } catch {
      shopify.toast.show("Failed to save free shipping settings", { isError: true });
    } finally {
      setSaving(false);
    }
  };

  const remaining = Math.max(0, threshold - PREVIEW_CART_AMOUNT);
  const progress = Math.min(100, (PREVIEW_CART_AMOUNT / threshold) * 100);
  const isAtThreshold = PREVIEW_CART_AMOUNT >= threshold;

  const renderPreviewMessage = () => {
    if (isAtThreshold) return <span>{atMessage}</span>;
    const parts = belowMessage.split("{amount}");
    return (
      <span>
        {parts[0]}
        <strong>${remaining.toFixed(2)}</strong>
        {parts[1]}
      </span>
    );
  };

  return (
    // subheading is a valid s-page runtime prop; cast needed because polaris-types omits it
    <s-page {...({ heading: "Free shipping bar", subheading: "Encourage larger carts with a progress bar toward free shipping." } as any)}>
      <ui-save-bar id={SAVE_BAR_ID} discardConfirmation>
        <button variant="primary" loading={saving} disabled={saving} onClick={handleSave}>
          Save
        </button>
        <button disabled={saving} onClick={handleDiscard}>
          Discard
        </button>
      </ui-save-bar>

      {/* Settings card */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e3e3e3",
          marginBottom: "16px",
          overflow: "hidden",
        }}
      >
        {/* Toggle row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
          }}
        >
          <div>
            <div style={{ fontWeight: "600", fontSize: "14px", marginBottom: "2px" }}>
              Show free shipping bar
            </div>
            <div style={{ fontSize: "13px", color: "#6d7175" }}>
              Displays at the top of the cart drawer.
            </div>
          </div>
          <s-switch
            label="Show free shipping bar"
            label-accessibility-visibility="hidden"
            checked={showBar}
            onChange={(e: any) => setShowBar(e.target.checked)}
          />
        </div>

        <div style={{ height: "1px", background: "#e3e3e3" }} />

        {/* Fields */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Threshold amount */}
          <div>
            <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "8px" }}>
              Threshold amount
            </div>
            <div style={{ maxWidth: "160px" }}>
              <s-money-field
                label="Threshold amount"
                label-accessibility-visibility="hidden"
                value={String(threshold)}
                min={0}
                onInput={(e: any) =>
                  setThreshold(parseFloat(e.target.value) || 0)
                }
              />
            </div>
          </div>

          {/* Below threshold message */}
          <div>
            <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "8px" }}>
              Below threshold message
            </div>
            <s-text-field
              label="Below threshold message"
              label-accessibility-visibility="hidden"
              value={belowMessage}
              onInput={(e: any) => setBelowMessage(e.target.value)}
            />
            <div style={{ fontSize: "12px", color: "#6d7175", marginTop: "6px" }}>
              Use{" "}
              <code
                style={{
                  background: "#f1f1f1",
                  padding: "1px 5px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "#bf4800",
                }}
              >
                {"{amount}"}
              </code>{" "}
              to insert the remaining spend.
            </div>
          </div>

          {/* At threshold message */}
          <div>
            <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "8px" }}>
              At threshold message
            </div>
            <s-text-field
              label="At threshold message"
              label-accessibility-visibility="hidden"
              value={atMessage}
              onInput={(e: any) => setAtMessage(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Preview card */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e3e3e3",
          padding: "20px 24px",
        }}
      >
        <div style={{ fontWeight: "600", fontSize: "15px", marginBottom: "16px" }}>
          Preview
        </div>

        {/* Shipping bar widget */}
        <div
          style={{
            background: "#f6f6f7",
            borderRadius: "8px",
            padding: "24px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "16px 20px",
              minWidth: "320px",
              maxWidth: "420px",
              width: "100%",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "10px",
                color: "#202223",
              }}
            >
              {renderPreviewMessage()}
            </div>

            {/* Progress bar */}
            <div
              style={{
                height: "6px",
                background: "#e3e3e3",
                borderRadius: "3px",
                marginBottom: "8px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: isAtThreshold ? "#008060" : "#2c6ecb",
                  borderRadius: "3px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            {/* Labels row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#6d7175",
              }}
            >
              <span>${PREVIEW_CART_AMOUNT.toFixed(2)} in cart</span>
              <span>${threshold.toFixed(2)} goal</span>
            </div>
          </div>
        </div>
      </div>
    </s-page>
  );
}
