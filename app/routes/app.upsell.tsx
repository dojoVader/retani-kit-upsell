import ThreshRule from "app/rules/ThreshRule";
import BundleRule from "app/rules/BundleRule";
import ProductRule from "app/rules/ProductRule";
import ReturningRule from "app/rules/ReturningRule";
import TagRule from "app/rules/TagRule";
import TimerRule from "app/rules/TimerRule";
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
  {
    id: "threshold",
    icon: "sort",
    title: "Threshold",
    description: "Cart value target",
  },
  {
    id: "product",
    icon: "link",
    title: "Product-based",
    description: "SKU or collection",
  },
  {
    id: "bundle",
    icon: "gift-card",
    title: "Bundle",
    description: "Frequently bought",
  },
  {
    id: "time",
    icon: "clock",
    title: "Time-based",
    description: "Session or schedule",
  },
  {
    id: "tag",
    icon: "person-segment",
    title: "Customer tag",
    description: "Segment-specific",
  },
  {
    id: "returning",
    icon: "redo",
    title: "Returning buyer",
    description: "Purchase history",
  },
];

function SectionCard({
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
        padding: "20px 24px",
        overflow: "hidden",
      }}
    >
      <div
        style={{ fontWeight: "600", fontSize: "15px", marginBottom: "16px" }}
      >
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
      {!noBorder && (
        <div
          style={{ height: "1px", background: "#f1f1f1", margin: "0 -24px" }}
        />
      )}
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
          <div
            style={{ fontWeight: "600", fontSize: "14px", color: "#202223" }}
          >
            {title}
          </div>
          <div style={{ fontSize: "13px", color: "#6d7175", marginTop: "2px" }}>
            {description}
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>{control}</div>
      </div>
    </>
  );
}

export default function UpsellPage() {
  const [selectedRule, setSelectedRule] = useState<RuleTypeId>("threshold");
  const [cartAbove, setCartAbove] = useState("0");
  const [containsProduct, setContainsProduct] = useState("");
  const [excludeOwned, setExcludeOwned] = useState(true);
  const [offerProduct, setOfferProduct] = useState("");
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState("10");
  const [oneClick, setOneClick] = useState(true);

  return (
    <s-page
      {...({
        heading: "Upsell Rules",
        subheading:
          "Define when and what to offer customers to increase cart value.",
      } as any)}
    >
      <s-button slot="primary-action" variant="primary">
        Save
      </s-button>

      {/* Rule type */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e3e3e3",
          padding: "20px 24px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{ fontWeight: "600", fontSize: "15px", marginBottom: "16px" }}
        >
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
              <div
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#202223",
                }}
              >
                {type.title}
              </div>
              <div
                style={{ fontSize: "12px", color: "#6d7175", marginTop: "2px" }}
              >
                {type.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Rule editor — swaps based on selected type */}
      {selectedRule === "threshold" && <ThreshRule />}
      {selectedRule === "bundle" && <BundleRule />}
      {selectedRule === "product" && <ProductRule />}
      {selectedRule === "returning" && <ReturningRule />}
      {selectedRule === "tag" && <TagRule />}
      {selectedRule === "time" && <TimerRule />}
    </s-page>
  );
}
