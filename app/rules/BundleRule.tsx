import { useState } from "react";
import { FieldRow, TabButton, ActionRow } from "./elements";
import { CartBundle } from "./cart-type/CartBundle";

type Tab = "trigger" | "offer" | "appearance";

interface TriggerTabProps {
  sourceCollection: string; onSourceCollection: (v: string) => void;
  excludeIfBundleInCart: boolean; onExcludeIfBundleInCart: (v: boolean) => void;
  minCartValue: string; onMinCartValue: (v: string) => void;
}

function TriggerTab({
  sourceCollection, onSourceCollection,
  excludeIfBundleInCart, onExcludeIfBundleInCart,
  minCartValue, onMinCartValue,
}: TriggerTabProps) {
  return (
    <div>
      <FieldRow
        name="sourceCollection"
        badge="required"
        description="Products from this collection trigger the rule"
        control={
          <input
            type="text"
            value={sourceCollection}
            placeholder="e.g. Cameras"
            onChange={(e) => onSourceCollection(e.target.value)}
            style={{ width: "180px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px" }}
          />
        }
      />
      <FieldRow
        name="excludeIfBundleInCart"
        badge="optional"
        description="Suppress if bundle item already in cart"
        control={
          <s-switch
            label="excludeIfBundleInCart"
            label-accessibility-visibility="hidden"
            checked={excludeIfBundleInCart}
            onChange={(e: any) => onExcludeIfBundleInCart(e.target.checked)}
          />
        }
      />
      <FieldRow
        name="minCartValue"
        badge="optional"
        description="Only fire above this subtotal"
        control={
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "14px", color: "#6d7175" }}>£</span>
            <input
              type="text"
              value={minCartValue}
              placeholder="none"
              onChange={(e) => onMinCartValue(e.target.value)}
              style={{ width: "80px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", textAlign: "right" }}
            />
          </div>
        }
      />
      <ActionRow />
    </div>
  );
}

interface OfferTabProps {
  recommendationSource: string; onRecommendationSource: (v: string) => void;
  maxBundleItems: string; onMaxBundleItems: (v: string) => void;
  bundleDiscount: string; onBundleDiscount: (v: string) => void;
  bundleDiscountValue: string; onBundleDiscountValue: (v: string) => void;
  showCompleteTheSetLabel: boolean; onShowCompleteTheSetLabel: (v: boolean) => void;
  priority: string; onPriority: (v: string) => void;
  abTest: boolean; onAbTest: (v: boolean) => void;
}

function OfferTab({
  recommendationSource, onRecommendationSource,
  maxBundleItems, onMaxBundleItems,
  bundleDiscount, onBundleDiscount,
  bundleDiscountValue, onBundleDiscountValue,
  showCompleteTheSetLabel, onShowCompleteTheSetLabel,
  priority, onPriority,
  abTest, onAbTest,
}: OfferTabProps) {
  return (
    <div>
      <FieldRow
        name="recommendationSource"
        badge="required"
        control={
          <select
            value={recommendationSource}
            onChange={(e) => onRecommendationSource(e.target.value)}
            style={{ padding: "7px 28px 7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", background: "#fff", cursor: "pointer", minWidth: "200px" }}
          >
            <option value="co-occurrence">Co-occurrence model</option>
            <option value="bestsellers">Bestsellers in collection</option>
            <option value="manual">Manual selection</option>
          </select>
        }
      />
      <FieldRow
        name="maxBundleItems"
        badge="optional"
        description="How many bundle offers to show (max 4)"
        control={
          <input
            type="number"
            value={maxBundleItems}
            min={1}
            max={4}
            onChange={(e) => onMaxBundleItems(e.target.value)}
            style={{ width: "70px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", textAlign: "right" }}
          />
        }
      />
      <FieldRow
        name="bundleDiscount"
        badge="optional"
        control={
          <select
            value={bundleDiscount}
            onChange={(e) => onBundleDiscount(e.target.value)}
            style={{ padding: "7px 28px 7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", background: "#fff", cursor: "pointer", minWidth: "100px" }}
          >
            <option value="none">none</option>
            <option value="percent">% off</option>
            <option value="fixed">£ off</option>
          </select>
        }
      />
      <FieldRow
        name="bundleDiscountValue"
        badge="optional"
        control={
          <input
            type="number"
            value={bundleDiscountValue}
            min={0}
            onChange={(e) => onBundleDiscountValue(e.target.value)}
            style={{ width: "70px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", textAlign: "right" }}
          />
        }
      />
      <FieldRow
        name="showCompleteTheSetLabel"
        badge="optional"
        control={
          <s-switch
            label="showCompleteTheSetLabel"
            label-accessibility-visibility="hidden"
            checked={showCompleteTheSetLabel}
            onChange={(e: any) => onShowCompleteTheSetLabel(e.target.checked)}
          />
        }
      />
      <FieldRow
        name="priority"
        badge="optional"
        control={
          <input
            type="number"
            value={priority}
            onChange={(e) => onPriority(e.target.value)}
            style={{ width: "70px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", textAlign: "right" }}
          />
        }
      />
      <FieldRow
        name="abTest"
        badge="pro"
        control={
          <s-switch
            label="abTest"
            label-accessibility-visibility="hidden"
            checked={abTest}
            onChange={(e: any) => onAbTest(e.target.checked)}
          />
        }
      />
      <ActionRow />
    </div>
  );
}

interface AppearanceTabProps {
  ctaButtonText: string; onCtaButtonText: (v: string) => void;
  slotPosition: string; onSlotPosition: (v: string) => void;
  showProductImage: boolean; onShowProductImage: (v: boolean) => void;
  showStarRatings: boolean; onShowStarRatings: (v: boolean) => void;
}

function AppearanceTab({
  ctaButtonText, onCtaButtonText,
  slotPosition, onSlotPosition,
  showProductImage, onShowProductImage,
  showStarRatings, onShowStarRatings,
}: AppearanceTabProps) {
  return (
    <div>
      <FieldRow
        name="ctaButtonText"
        badge="optional"
        control={
          <input
            type="text"
            value={ctaButtonText}
            onChange={(e) => onCtaButtonText(e.target.value)}
            style={{ width: "200px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px" }}
          />
        }
      />
      <FieldRow
        name="slotPosition"
        badge="optional"
        control={
          <select
            value={slotPosition}
            onChange={(e) => onSlotPosition(e.target.value)}
            style={{ padding: "7px 28px 7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", background: "#fff", cursor: "pointer", minWidth: "180px" }}
          >
            <option value="below-cart-items">Below cart items</option>
            <option value="above-cart-items">Above cart items</option>
            <option value="below-subtotal">Below subtotal</option>
          </select>
        }
      />
      <FieldRow
        name="showProductImage"
        badge="optional"
        control={
          <s-switch
            label="showProductImage"
            label-accessibility-visibility="hidden"
            checked={showProductImage}
            onChange={(e: any) => onShowProductImage(e.target.checked)}
          />
        }
      />
      <FieldRow
        name="showStarRatings"
        badge="pro"
        control={
          <s-switch
            label="showStarRatings"
            label-accessibility-visibility="hidden"
            checked={showStarRatings}
            onChange={(e: any) => onShowStarRatings(e.target.checked)}
          />
        }
      />
      <ActionRow />
    </div>
  );
}

export default function BundleRule() {
  const [activeTab, setActiveTab] = useState<Tab>("trigger");

  // Trigger
  const [sourceCollection, setSourceCollection] = useState("");
  const [excludeIfBundleInCart, setExcludeIfBundleInCart] = useState(true);
  const [minCartValue, setMinCartValue] = useState("");

  // Offer
  const [recommendationSource, setRecommendationSource] = useState("co-occurrence");
  const [maxBundleItems, setMaxBundleItems] = useState("2");
  const [bundleDiscount, setBundleDiscount] = useState("none");
  const [bundleDiscountValue, setBundleDiscountValue] = useState("0");
  const [showCompleteTheSetLabel, setShowCompleteTheSetLabel] = useState(true);
  const [priority, setPriority] = useState("8");
  const [abTest, setAbTest] = useState(false);

  // Appearance
  const [ctaButtonText, setCtaButtonText] = useState("Add to cart");
  const [slotPosition, setSlotPosition] = useState("below-cart-items");
  const [showProductImage, setShowProductImage] = useState(true);
  const [showStarRatings, setShowStarRatings] = useState(false);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "24px", alignItems: "start" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e3e3e3",
          padding: "0 24px 24px",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", borderBottom: "1px solid #e3e3e3", marginBottom: "4px" }}>
          <TabButton label="Trigger" active={activeTab === "trigger"} onClick={() => setActiveTab("trigger")} />
          <TabButton label="Offer" active={activeTab === "offer"} onClick={() => setActiveTab("offer")} />
          <TabButton label="Appearance" active={activeTab === "appearance"} onClick={() => setActiveTab("appearance")} />
        </div>

        {activeTab === "trigger" && (
          <TriggerTab
            sourceCollection={sourceCollection} onSourceCollection={setSourceCollection}
            excludeIfBundleInCart={excludeIfBundleInCart} onExcludeIfBundleInCart={setExcludeIfBundleInCart}
            minCartValue={minCartValue} onMinCartValue={setMinCartValue}
          />
        )}
        {activeTab === "offer" && (
          <OfferTab
            recommendationSource={recommendationSource} onRecommendationSource={setRecommendationSource}
            maxBundleItems={maxBundleItems} onMaxBundleItems={setMaxBundleItems}
            bundleDiscount={bundleDiscount} onBundleDiscount={setBundleDiscount}
            bundleDiscountValue={bundleDiscountValue} onBundleDiscountValue={setBundleDiscountValue}
            showCompleteTheSetLabel={showCompleteTheSetLabel} onShowCompleteTheSetLabel={setShowCompleteTheSetLabel}
            priority={priority} onPriority={setPriority}
            abTest={abTest} onAbTest={setAbTest}
          />
        )}
        {activeTab === "appearance" && (
          <AppearanceTab
            ctaButtonText={ctaButtonText} onCtaButtonText={setCtaButtonText}
            slotPosition={slotPosition} onSlotPosition={setSlotPosition}
            showProductImage={showProductImage} onShowProductImage={setShowProductImage}
            showStarRatings={showStarRatings} onShowStarRatings={setShowStarRatings}
          />
        )}
      </div>

      <div style={{ position: "sticky", top: "16px" }}>
        <CartBundle
          showProductImage={showProductImage}
          ctaButtonText={ctaButtonText}
          maxBundleItems={maxBundleItems}
          bundleDiscount={bundleDiscount}
          bundleDiscountValue={bundleDiscountValue}
          showCompleteTheSetLabel={showCompleteTheSetLabel}
        />
      </div>
    </div>
  );
}
