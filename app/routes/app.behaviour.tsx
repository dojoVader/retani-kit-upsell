import { useEffect, useRef, useState, type ReactNode } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { useAuthenticatedFetch } from "app/utils/useAuthenticatedFetch";
import redis from "../redis";

const SAVE_BAR_ID = "behaviour-settings-save-bar";

interface BehaviourSettings {
  openOnAddToCart: boolean;
  interceptCartPage: boolean;
  showProgressBar: boolean;
  conflictMode: "priority" | "discount" | "stacked" | "hierarchy";
  cooldownSessions: number;
  dismissRemembered: boolean;
}

const DEFAULT_BEHAVIOUR_SETTINGS: BehaviourSettings = {
  openOnAddToCart: true,
  interceptCartPage: true,
  showProgressBar: true,
  conflictMode: "priority",
  cooldownSessions: 1,
  dismissRemembered: true,
};

// Matches ShopSettingsSection.BEHAVIOUR in web/src/entities/types/shop-settings.types.ts
const BEHAVIOUR_SECTION = "behaviour";

// Mirrors ShopSettingService#cacheKey in web/src/modules/shop-settings/services/shop-setting.service.ts
function behaviourCacheKey(shopDomain: string): string {
  return `shop:settings:${BEHAVIOUR_SECTION}_${shopDomain}`;
}

// Loads the behaviour settings for the shop resolved from the App Bridge session,
// reading straight from the same Redis cache the NestJS backend populates.
async function getBehaviourSettings(shopDomain: string): Promise<BehaviourSettings> {
  try {
    const cached = await redis.get(behaviourCacheKey(shopDomain));
    if (!cached) {
      return DEFAULT_BEHAVIOUR_SETTINGS;
    }

    const { value } = JSON.parse(cached) as { value: Partial<BehaviourSettings> };
    return { ...DEFAULT_BEHAVIOUR_SETTINGS, ...value };
  } catch {
    return DEFAULT_BEHAVIOUR_SETTINGS;
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await getBehaviourSettings(session.shop);

  return { settings };
};

function ProBadge() {
  return (
    <span
      style={{
        display: "inline-block",
        background: "#ede9fe",
        color: "#6d28d9",
        fontSize: "12px",
        fontWeight: "600",
        padding: "2px 10px",
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
        marginBottom: "16px",
        overflow: "hidden",
      }}
    >
      <div style={{ fontWeight: "600", fontSize: "15px", padding: "16px 24px 0" }}>
        {heading}
      </div>
      {children}
    </div>
  );
}

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
    <>
      <div style={{ height: "1px", background: "#e3e3e3", margin: "0 24px" }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 24px",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ fontWeight: "600", fontSize: "14px", color: "#202223" }}>{title}</div>
          <div style={{ fontSize: "13px", color: "#6d7175", marginTop: "2px" }}>{description}</div>
        </div>
        <div style={{ flexShrink: 0 }}>{control}</div>
      </div>
    </>
  );
}

export default function BehaviourPage() {
  const { settings } = useLoaderData<typeof loader>();
  const shopifyFetch = useAuthenticatedFetch();

  const [openOnAdd, setOpenOnAdd] = useState(settings.openOnAddToCart);
  const [interceptCart, setInterceptCart] = useState(settings.interceptCartPage);
  const [showShipping, setShowShipping] = useState(settings.showProgressBar);
  const [conflictResolution, setConflictResolution] = useState<string>(settings.conflictMode);
  const [cooldown, setCooldown] = useState(settings.cooldownSessions);
  const [dismissRemember, setDismissRemember] = useState(settings.dismissRemembered);
  const [saving, setSaving] = useState(false);

  // Baseline used to detect unsaved changes and to restore on discard.
  const savedSettingsRef = useRef(settings);

  useEffect(() => {
    const saved = savedSettingsRef.current;
    const isDirty =
      openOnAdd !== saved.openOnAddToCart ||
      interceptCart !== saved.interceptCartPage ||
      showShipping !== saved.showProgressBar ||
      conflictResolution !== saved.conflictMode ||
      cooldown !== saved.cooldownSessions ||
      dismissRemember !== saved.dismissRemembered;

    if (isDirty) {
      void shopify.saveBar.show(SAVE_BAR_ID);
    } else {
      void shopify.saveBar.hide(SAVE_BAR_ID);
    }
  }, [openOnAdd, interceptCart, showShipping, conflictResolution, cooldown, dismissRemember]);

  const handleDiscard = () => {
    const saved = savedSettingsRef.current;
    setOpenOnAdd(saved.openOnAddToCart);
    setInterceptCart(saved.interceptCartPage);
    setShowShipping(saved.showProgressBar);
    setConflictResolution(saved.conflictMode);
    setCooldown(saved.cooldownSessions);
    setDismissRemember(saved.dismissRemembered);
    void shopify.saveBar.hide(SAVE_BAR_ID);
  };

  const handleSave = async () => {
    const payload: BehaviourSettings = {
      openOnAddToCart: openOnAdd,
      interceptCartPage: interceptCart,
      showProgressBar: showShipping,
      conflictMode: conflictResolution as BehaviourSettings["conflictMode"],
      cooldownSessions: cooldown,
      dismissRemembered: dismissRemember,
    };

    setSaving(true);
    try {
      await shopifyFetch("shop-settings/behaviour", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      savedSettingsRef.current = payload;
      void shopify.saveBar.hide(SAVE_BAR_ID);
      shopify.toast.show("Behaviour settings saved");
    } catch {
      shopify.toast.show("Failed to save behaviour settings", { isError: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    // subheading is a valid s-page runtime prop; cast needed because polaris-types omits it
    <s-page
      {...({
        heading: "Behaviour",
        subheading: "Control when the drawer opens and how rules resolve.",
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

      {/* Drawer triggers */}
      <Card heading="Drawer triggers">
        <SettingRow
          title="Open drawer on add to cart"
          description="Auto-opens whenever a product is added"
          control={
            <s-switch
              label="Open drawer on add to cart"
              label-accessibility-visibility="hidden"
              checked={openOnAdd}
              onChange={(e: any) => setOpenOnAdd(e.target.checked)}
            />
          }
        />
        <SettingRow
          title="Intercept native cart page"
          description="Redirect /cart to this drawer instead"
          control={
            <s-switch
              label="Intercept native cart page"
              label-accessibility-visibility="hidden"
              checked={interceptCart}
              onChange={(e: any) => setInterceptCart(e.target.checked)}
            />
          }
        />
        <SettingRow
          title="Show free shipping progress bar"
          description="Displays at top of drawer"
          control={
            <s-switch
              label="Show free shipping progress bar"
              label-accessibility-visibility="hidden"
              checked={showShipping}
              onChange={(e: any) => setShowShipping(e.target.checked)}
            />
          }
        />
        <div style={{ height: "16px" }} />
      </Card>

      {/* Rule priority & limits */}
      <Card heading="Rule priority & limits">
        <SettingRow
          title="Conflict resolution"
          description="When multiple rules match the same cart"
          control={
            <div style={{ width: "200px" }}>
              <s-select
                label="Conflict resolution"
                label-accessibility-visibility="hidden"
                value={conflictResolution}
                onChange={(e: any) => setConflictResolution(e.target.value)}
              >
                <s-option value="highest">Highest priority wins</s-option>
                <s-option value="random">Random selection</s-option>
                <s-option value="first">First match wins</s-option>
              </s-select>
            </div>
          }
        />
        <SettingRow
          title="Cooldown between offers"
          description="Sessions before re-showing the same offer"
          control={
            <div style={{ width: "80px" }}>
              <s-number-field
                label="Cooldown"
                label-accessibility-visibility="hidden"
                value={String(cooldown)}
                min={0}
                step={1}
                onInput={(e: any) =>
                  setCooldown(Math.max(0, parseInt(e.target.value) || 0))
                }
              />
            </div>
          }
        />
        <SettingRow
          title="Dismiss remembers preference"
          description="Don't re-show if dismissed this session"
          control={
            <s-switch
              label="Dismiss remembers preference"
              label-accessibility-visibility="hidden"
              checked={dismissRemember}
              onChange={(e: any) => setDismissRemember(e.target.checked)}
            />
          }
        />
        <SettingRow
          title="A/B testing mode"
          description="Split traffic between two offer variants"
          control={<ProBadge />}
        />
        <div style={{ height: "16px" }} />
      </Card>
    </s-page>
  );
}
