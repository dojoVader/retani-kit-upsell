import { useEffect, useRef, useState, type ReactNode } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { useAuthenticatedFetch } from "app/utils/useAuthenticatedFetch";
import redis from "../redis";

const SAVE_BAR_ID = "targeting-settings-save-bar";

interface TargetingSettings {
  customerSegment: string;
  showToNewVisitors: boolean;
  showToReturningBuyers: boolean;
  mobileDevicesEnabled: boolean;
  countries: string;
  minimumItemsInCart: number;
}

const DEFAULT_TARGETING_SETTINGS: TargetingSettings = {
  customerSegment: "all",
  showToNewVisitors: true,
  showToReturningBuyers: true,
  mobileDevicesEnabled: true,
  countries: "all",
  minimumItemsInCart: 1,
};

// Matches ShopSettingsSection.TARGET in web/src/entities/types/shop-settings.types.ts
const TARGET_SECTION = "target";

// Mirrors ShopSettingService#cacheKey in web/src/modules/shop-settings/services/shop-setting.service.ts
function targetingCacheKey(shopDomain: string): string {
  return `shop:settings:${TARGET_SECTION}_${shopDomain}`;
}

// Loads the targeting settings for the shop resolved from the App Bridge session,
// reading straight from the same Redis cache the NestJS backend populates.
async function getTargetingSettings(shopDomain: string): Promise<TargetingSettings> {
  try {
    const cached = await redis.get(targetingCacheKey(shopDomain));
    if (!cached) {
      return DEFAULT_TARGETING_SETTINGS;
    }

    const { value } = JSON.parse(cached) as { value: Partial<TargetingSettings> };
    return { ...DEFAULT_TARGETING_SETTINGS, ...value };
  } catch {
    return DEFAULT_TARGETING_SETTINGS;
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await getTargetingSettings(session.shop);

  return { settings };
};

function SettingRow({
  title,
  description,
  control,
}: {
  title: string;
  description: string;
  control: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        gap: "24px",
      }}
    >
      <div>
        <div style={{ fontWeight: "600", fontSize: "14px", color: "#202223" }}>
          {title}
        </div>
        <div style={{ fontSize: "13px", color: "#6d7175", marginTop: "2px" }}>
          {description}
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>{control}</div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "#e3e3e3", margin: "0 24px" }} />;
}

function Card({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e3e3e3",
        marginBottom: "16px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontWeight: "600",
          fontSize: "15px",
          padding: "16px 24px 12px",
          color: "#202223",
        }}
      >
        {heading}
      </div>
      <Divider />
      {children}
    </div>
  );
}

export default function TargetingPage() {
  const { settings } = useLoaderData<typeof loader>();
  const shopifyFetch = useAuthenticatedFetch();

  const [customerSegment, setCustomerSegment] = useState(settings.customerSegment);
  const [showNewVisitors, setShowNewVisitors] = useState(settings.showToNewVisitors);
  const [showReturning, setShowReturning] = useState(settings.showToReturningBuyers);
  const [mobileDevices, setMobileDevices] = useState(settings.mobileDevicesEnabled);
  const [countries, setCountries] = useState(settings.countries);
  const [minItems, setMinItems] = useState(settings.minimumItemsInCart);
  const [saving, setSaving] = useState(false);

  // Baseline used to detect unsaved changes and to restore on discard.
  const savedSettingsRef = useRef(settings);

  useEffect(() => {
    const saved = savedSettingsRef.current;
    const isDirty =
      customerSegment !== saved.customerSegment ||
      showNewVisitors !== saved.showToNewVisitors ||
      showReturning !== saved.showToReturningBuyers ||
      mobileDevices !== saved.mobileDevicesEnabled ||
      countries !== saved.countries ||
      minItems !== saved.minimumItemsInCart;

    if (isDirty) {
      void shopify.saveBar.show(SAVE_BAR_ID);
    } else {
      void shopify.saveBar.hide(SAVE_BAR_ID);
    }
  }, [customerSegment, showNewVisitors, showReturning, mobileDevices, countries, minItems]);

  const handleDiscard = () => {
    const saved = savedSettingsRef.current;
    setCustomerSegment(saved.customerSegment);
    setShowNewVisitors(saved.showToNewVisitors);
    setShowReturning(saved.showToReturningBuyers);
    setMobileDevices(saved.mobileDevicesEnabled);
    setCountries(saved.countries);
    setMinItems(saved.minimumItemsInCart);
    void shopify.saveBar.hide(SAVE_BAR_ID);
  };

  const handleSave = async () => {
    const payload: TargetingSettings = {
      customerSegment,
      showToNewVisitors: showNewVisitors,
      showToReturningBuyers: showReturning,
      mobileDevicesEnabled: mobileDevices,
      countries,
      minimumItemsInCart: minItems,
    };

    setSaving(true);
    try {
      await shopifyFetch("shop-settings/target", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      savedSettingsRef.current = payload;
      void shopify.saveBar.hide(SAVE_BAR_ID);
      shopify.toast.show("Targeting settings saved");
    } catch {
      shopify.toast.show("Failed to save targeting settings", { isError: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    // subheading is a valid s-page runtime prop; cast needed because polaris-types omits it
    <s-page {...({ heading: "Targeting", subheading: "Choose which shoppers and devices see upsell offers." } as any)}
    >
      <ui-save-bar id={SAVE_BAR_ID} discardConfirmation>
        <button variant="primary" loading={saving} disabled={saving} onClick={handleSave}>
          Save
        </button>
        <button disabled={saving} onClick={handleDiscard}>
          Discard
        </button>
      </ui-save-bar>

      {/* Audience card */}
      <Card heading="Audience">
        <SettingRow
          title="Customer segment"
          description="Who is eligible for offers"
          control={
            <s-select
              label="Customer segment"
              label-accessibility-visibility="hidden"
              value={customerSegment}
              onChange={(e: any) => setCustomerSegment(e.target.value)}
            >
              <s-option value="all">All shoppers</s-option>
              <s-option value="logged_in">Logged-in customers</s-option>
              <s-option value="guests">Guests only</s-option>
            </s-select>
          }
        />
        <Divider />
        <SettingRow
          title="Show to new visitors"
          description="No prior purchase history"
          control={
            <s-switch
              label="Show to new visitors"
              label-accessibility-visibility="hidden"
              checked={showNewVisitors}
              onChange={(e: any) => setShowNewVisitors(e.target.checked)}
            />
          }
        />
        <Divider />
        <SettingRow
          title="Show to returning buyers"
          description="At least one prior order"
          control={
            <s-switch
              label="Show to returning buyers"
              label-accessibility-visibility="hidden"
              checked={showReturning}
              onChange={(e: any) => setShowReturning(e.target.checked)}
            />
          }
        />
      </Card>

      {/* Placement card */}
      <Card heading="Placement">
        <SettingRow
          title="Mobile devices"
          description="Show the drawer on phones"
          control={
            <s-switch
              label="Mobile devices"
              label-accessibility-visibility="hidden"
              checked={mobileDevices}
              onChange={(e: any) => setMobileDevices(e.target.checked)}
            />
          }
        />
        <Divider />
        <SettingRow
          title="Countries"
          description="Limit by shipping destination"
          control={
            <s-select
              label="Countries"
              label-accessibility-visibility="hidden"
              value={countries}
              onChange={(e: any) => setCountries(e.target.value)}
            >
              <s-option value="all">All countries</s-option>
              <s-option value="us">United States</s-option>
              <s-option value="ca">Canada</s-option>
              <s-option value="gb">United Kingdom</s-option>
              <s-option value="au">Australia</s-option>
            </s-select>
          }
        />
        <Divider />
        <SettingRow
          title="Minimum items in cart"
          description="Only target carts with at least N items"
          control={
            <div style={{ width: "80px" }}>
              <s-number-field
                label="Minimum items in cart"
                label-accessibility-visibility="hidden"
                value={String(minItems)}
                min={1}
                step={1}
                onInput={(e: any) =>
                  setMinItems(Math.max(1, parseInt(e.target.value) || 1))
                }
              />
            </div>
          }
        />
      </Card>
    </s-page>
  );
}
