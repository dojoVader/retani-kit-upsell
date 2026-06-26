import { useState, type ReactNode } from "react";

type RuleTypeId =
  | "threshold"
  | "product"
  | "bundle"
  | "time"
  | "tag"
  | "returning";

const RULE_TYPES: {
  id: RuleTypeId;
  icon: string;
  title: string;
  description: string;
}[] = [
  { id: "threshold", icon: "sort", title: "Threshold", description: "Cart value target" },
  { id: "product", icon: "link", title: "Product-based", description: "SKU or collection" },
  { id: "bundle", icon: "gift-card", title: "Bundle", description: "Frequently bought" },
  { id: "time", icon: "clock", title: "Time-based", description: "Session or schedule" },
  { id: "tag", icon: "person-segment", title: "Customer tag", description: "Segment-specific" },
  { id: "returning", icon: "redo", title: "Returning buyer", description: "Purchase history" },
];

function SectionCard({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e3e3e3",
        padding: "20px 24px",
        overflow: "hidden",
      }}
    >
      <div style={{ fontWeight: "600", fontSize: "15px", marginBottom: "16px" }}>
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
  noBorder = false,
}: {
  title: string;
  description: string;
  control: ReactNode;
  noBorder?: boolean;
}) {
  return (
    <>
      {!noBorder && <div style={{ height: "1px", background: "#f1f1f1", margin: "0 -24px" }} />}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 0",
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

export default function Upsell() {
  const [selectedRule, setSelectedRule] = useState<RuleTypeId>("threshold");
  const [cartAbove, setCartAbove] = useState("0");
  const [containsProduct, setContainsProduct] = useState("");
  const [excludeOwned, setExcludeOwned] = useState(true);
  const [offerProduct, setOfferProduct] = useState("");
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState("10");
  const [oneClick, setOneClick] = useState(true);

  return (
    // subheading is a valid s-page runtime prop; cast needed because polaris-types omits it

      <s-modal id={"upsell-modal"} size={"large-100"} heading={"Create an Upsell Rule"} >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e3e3e3",
          padding: "20px 24px",
          marginBottom: "16px",
        }}
      >
        <div style={{ fontWeight: "600", fontSize: "15px", marginBottom: "16px" }}>
          Rule type
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
          }}
        >
          {RULE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedRule(type.id)}
              style={{
                background: "#fff",
                border:
                  selectedRule === type.id
                    ? "2px solid #202223"
                    : "1px solid #e3e3e3",
                borderRadius: "8px",
                padding: "16px",
                cursor: "pointer",
                textAlign: "left",
                transition: "border-color 0.15s ease",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <s-icon type={type.icon as any} />
              </div>
              <div style={{ fontWeight: "600", fontSize: "14px", color: "#202223" }}>
                {type.title}
              </div>
              <div style={{ fontSize: "12px", color: "#6d7175", marginTop: "2px" }}>
                {type.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trigger conditions + Offer settings side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Trigger conditions */}
        <SectionCard heading="Trigger conditions">
          <SettingRow
            title="Cart value above"
            description="Minimum cart subtotal"
            noBorder
            control={
              <div style={{ width: "100px" }}>
                <s-money-field
                  label="Cart value above"
                  label-accessibility-visibility="hidden"
                  value={cartAbove}
                  min={0}
                  onInput={(e: any) => setCartAbove(e.target.value)}
                />
              </div>
            }
          />
          <SettingRow
            title="Cart value below"
            description="Upper threshold (optional)"
            control={
              <div style={{ width: "100px" }}>
                <s-money-field
                  label="Cart value below"
                  label-accessibility-visibility="hidden"
                  value=""
                  min={0}
                />
              </div>
            }
          />
          <SettingRow
            title="Contains product"
            description="Fire only if cart includes SKU"
            control={
              <div style={{ width: "160px" }}>
                <s-search-field
                  label="Contains product"
                  label-accessibility-visibility="hidden"
                  value={containsProduct}
                  onInput={(e: any) => setContainsProduct(e.target.value)}
                />
              </div>
            }
          />
          <SettingRow
            title="Exclude if already owns"
            description="Skip if bought before"
            control={
              <s-switch
                label="Exclude if already owns"
                label-accessibility-visibility="hidden"
                checked={excludeOwned}
                onChange={(e: any) => setExcludeOwned(e.target.checked)}
              />
            }
          />
        </SectionCard>

        {/* Offer settings */}
        <SectionCard heading="Offer settings">
          <SettingRow
            title="Offer product"
            description="Shown in the drawer"
            noBorder
            control={
              <div style={{ width: "160px" }}>
                <s-search-field
                  label="Offer product"
                  label-accessibility-visibility="hidden"
                  value={offerProduct}
                  onInput={(e: any) => setOfferProduct(e.target.value)}
                />
              </div>
            }
          />
          <SettingRow
            title="Discount type"
            description=""
            control={
              <div style={{ width: "140px" }}>
                <s-select
                  label="Discount type"
                  label-accessibility-visibility="hidden"
                  value={discountType}
                  onChange={(e: any) => setDiscountType(e.target.value)}
                >
                  <s-option value="percent">% off</s-option>
                  <s-option value="fixed">$ off</s-option>
                  <s-option value="none">None</s-option>
                </s-select>
              </div>
            }
          />
          <SettingRow
            title="Discount value"
            description=""
            control={
              <div style={{ width: "100px" }}>
                <s-text-field
                  label="Discount value"
                  label-accessibility-visibility="hidden"
                  value={`${discountValue}%`}
                  onInput={(e: any) =>
                    setDiscountValue(e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              </div>
            }
          />
          <SettingRow
            title="One-click add to cart"
            description="Skip variant selection"
            control={
              <s-switch
                label="One-click add to cart"
                label-accessibility-visibility="hidden"
                checked={oneClick}
                onChange={(e: any) => setOneClick(e.target.checked)}
              />
            }
          />
        </SectionCard>
      </div>
        <s-button slot="secondary-actions" commandFor="upsell-modal" command="--hide">
          Close
        </s-button>
        <s-button
          slot="primary-action"
          variant="primary"
          commandFor="upsell-modal"
          command="--hide"
        >
          Save
        </s-button>
      </s-modal>

  );
}
