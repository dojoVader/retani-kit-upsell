import { useState, type ReactNode } from "react";

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
  const [drawerPosition, setDrawerPosition] = useState("right");
  const [upsellSlot, setUpsellSlot] = useState("below");
  const [maxOffers, setMaxOffers] = useState(2);
  const [showProductImage, setShowProductImage] = useState(true);
  const [showStarRatings, setShowStarRatings] = useState(false);

  const [headingFont, setHeadingFont] = useState("inherit");
  const [accentColor, setAccentColor] = useState("#2c6ecb");
  const [ctaText, setCtaText] = useState("Add to cart");

  return (
    // subheading is a valid s-page runtime prop; cast needed because polaris-types omits it
    <s-page
      {...({
        heading: "Drawer design",
        subheading: "Layout and branding for the cart drawer.",
      } as any)}
    >
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
