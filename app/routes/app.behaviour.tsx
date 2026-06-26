import { useState, type ReactNode } from "react";

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
  const [openOnAdd, setOpenOnAdd] = useState(true);
  const [interceptCart, setInterceptCart] = useState(true);
  const [showShipping, setShowShipping] = useState(true);
  const [conflictResolution, setConflictResolution] = useState("highest");
  const [cooldown, setCooldown] = useState(1);
  const [dismissRemember, setDismissRemember] = useState(true);

  return (
    // subheading is a valid s-page runtime prop; cast needed because polaris-types omits it
    <s-page
      {...({
        heading: "Behaviour",
        subheading: "Control when the drawer opens and how rules resolve.",
      } as any)}
    >
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
