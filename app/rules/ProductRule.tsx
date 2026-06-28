import { useState } from "react";
import { FieldRow, TabButton, ActionRow } from "./elements";
import { CartProduct } from "./cart-type/CartProduct";

type Tab = "trigger" | "offer" | "appearance";

interface TriggerTabProps {
  triggerType: string; onTriggerType: (v: string) => void;
  triggerProductId: string; onTriggerProductId: (v: string) => void;
  minQty: string; onMinQty: (v: string) => void;
  excludeIfOfferInCart: boolean; onExcludeIfOfferInCart: (v: boolean) => void;
  excludeCollections: string; onExcludeCollections: (v: string) => void;
}

function TriggerTab({
  triggerType, onTriggerType,
  triggerProductId, onTriggerProductId,
  minQty, onMinQty,
  excludeIfOfferInCart, onExcludeIfOfferInCart,
  excludeCollections, onExcludeCollections,
}: TriggerTabProps) {
  return (
    <div>
      <FieldRow
        name="triggerType"
        badge="required"
        description="What to match in the cart"
        control={
          <select
            value={triggerType}
            onChange={(e) => onTriggerType(e.target.value)}
            style={{ padding: "7px 28px 7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", background: "#fff", cursor: "pointer", minWidth: "180px" }}
          >
            <option value="specific-product">Specific product</option>
            <option value="any-product">Any product</option>
            <option value="collection">Collection</option>
          </select>
        }
      />
      <FieldRow
        name="triggerProductId"
        badge="required"
        description="Shopify product GID — required for Specific product"
        control={
          <input
            type="text"
            value={triggerProductId}
            placeholder="Search products..."
            onChange={(e) => onTriggerProductId(e.target.value)}
            style={{ width: "200px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px" }}
          />
        }
      />
      <FieldRow
        name="minQty"
        badge="optional"
        description="Min matching items in cart"
        control={
          <input
            type="number"
            value={minQty}
            min={1}
            onChange={(e) => onMinQty(e.target.value)}
            style={{ width: "70px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", textAlign: "right" }}
          />
        }
      />
      <FieldRow
        name="excludeIfOfferInCart"
        badge="optional"
        description="Suppress if offer already added"
        control={
          <s-switch
            label="excludeIfOfferInCart"
            label-accessibility-visibility="hidden"
            checked={excludeIfOfferInCart}
            onChange={(e: any) => onExcludeIfOfferInCart(e.target.checked)}
          />
        }
      />
      <FieldRow
        name="excludeCollections"
        badge="optional"
        control={
          <input
            type="text"
            value={excludeCollections}
            placeholder="e.g. gift-cards"
            onChange={(e) => onExcludeCollections(e.target.value)}
            style={{ width: "180px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px" }}
          />
        }
      />
      <ActionRow />
    </div>
  );
}

interface OfferTabProps {
  recommendationSource: string; onRecommendationSource: (v: string) => void;
  offerProductId: string; onOfferProductId: (v: string) => void;
  headline: string; onHeadline: (v: string) => void;
  discountType: string; onDiscountType: (v: string) => void;
  discountValue: string; onDiscountValue: (v: string) => void;
  showRating: boolean; onShowRating: (v: boolean) => void;
  oneClickAdd: boolean; onOneClickAdd: (v: boolean) => void;
  slotPosition: string; onSlotPosition: (v: string) => void;
  priority: string; onPriority: (v: string) => void;
  cooldown: string; onCooldown: (v: string) => void;
  abTest: boolean; onAbTest: (v: boolean) => void;
}

function OfferTab({
  recommendationSource, onRecommendationSource,
  offerProductId, onOfferProductId,
  headline, onHeadline,
  discountType, onDiscountType,
  discountValue, onDiscountValue,
  showRating, onShowRating,
  oneClickAdd, onOneClickAdd,
  slotPosition, onSlotPosition,
  priority, onPriority,
  cooldown, onCooldown,
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
            style={{ padding: "7px 28px 7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", background: "#fff", cursor: "pointer", minWidth: "180px" }}
          >
            <option value="manual">Manual pick</option>
            <option value="co-occurrence">Co-occurrence model</option>
            <option value="bestsellers">Bestsellers in collection</option>
          </select>
        }
      />
      <FieldRow
        name="offerProductId"
        badge="required"
        description="Required when source is manual"
        control={
          <input
            type="text"
            value={offerProductId}
            placeholder="Search products..."
            onChange={(e) => onOfferProductId(e.target.value)}
            style={{ width: "200px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px" }}
          />
        }
      />
      <FieldRow
        name="headline"
        badge="optional"
        control={
          <input
            type="text"
            value={headline}
            onChange={(e) => onHeadline(e.target.value)}
            style={{ width: "200px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px" }}
          />
        }
      />
      <FieldRow
        name="discountType"
        badge="optional"
        control={
          <select
            value={discountType}
            onChange={(e) => onDiscountType(e.target.value)}
            style={{ padding: "7px 28px 7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", background: "#fff", cursor: "pointer", minWidth: "100px" }}
          >
            <option value="none">none</option>
            <option value="percent">% off</option>
            <option value="fixed">£ off</option>
          </select>
        }
      />
      <FieldRow
        name="discountValue"
        badge="optional"
        control={
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "14px", color: "#6d7175" }}>%</span>
            <input
              type="number"
              value={discountValue}
              min={0}
              onChange={(e) => onDiscountValue(e.target.value)}
              style={{ width: "70px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", textAlign: "right" }}
            />
          </div>
        }
      />
      <FieldRow
        name="showRating"
        badge="optional"
        control={
          <s-switch
            label="showRating"
            label-accessibility-visibility="hidden"
            checked={showRating}
            onChange={(e: any) => onShowRating(e.target.checked)}
          />
        }
      />
      <FieldRow
        name="oneClickAdd"
        badge="optional"
        description="Skip variant picker if single variant"
        control={
          <s-switch
            label="oneClickAdd"
            label-accessibility-visibility="hidden"
            checked={oneClickAdd}
            onChange={(e: any) => onOneClickAdd(e.target.checked)}
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
        name="cooldown"
        badge="optional"
        control={
          <select
            value={cooldown}
            onChange={(e) => onCooldown(e.target.value)}
            style={{ padding: "7px 28px 7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", background: "#fff", cursor: "pointer", minWidth: "120px" }}
          >
            <option value="session">session</option>
            <option value="1day">1 day</option>
            <option value="7days">7 days</option>
            <option value="never">never</option>
          </select>
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

export default function ProductRule() {
  const [activeTab, setActiveTab] = useState<Tab>("trigger");

  // Trigger
  const [triggerType, setTriggerType] = useState("specific-product");
  const [triggerProductId, setTriggerProductId] = useState("");
  const [minQty, setMinQty] = useState("1");
  const [excludeIfOfferInCart, setExcludeIfOfferInCart] = useState(true);
  const [excludeCollections, setExcludeCollections] = useState("");

  // Offer
  const [recommendationSource, setRecommendationSource] = useState("manual");
  const [offerProductId, setOfferProductId] = useState("");
  const [headline, setHeadline] = useState("Pairs perfectly with this");
  const [discountType, setDiscountType] = useState("none");
  const [discountValue, setDiscountValue] = useState("0");
  const [showRating, setShowRating] = useState(false);
  const [oneClickAdd, setOneClickAdd] = useState(true);
  const [offerSlotPosition, setOfferSlotPosition] = useState("below-cart-items");
  const [priority, setPriority] = useState("10");
  const [cooldown, setCooldown] = useState("session");
  const [abTest, setAbTest] = useState(false);

  // Appearance
  const [ctaButtonText, setCtaButtonText] = useState("+ Add");
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
            triggerType={triggerType} onTriggerType={setTriggerType}
            triggerProductId={triggerProductId} onTriggerProductId={setTriggerProductId}
            minQty={minQty} onMinQty={setMinQty}
            excludeIfOfferInCart={excludeIfOfferInCart} onExcludeIfOfferInCart={setExcludeIfOfferInCart}
            excludeCollections={excludeCollections} onExcludeCollections={setExcludeCollections}
          />
        )}
        {activeTab === "offer" && (
          <OfferTab
            recommendationSource={recommendationSource} onRecommendationSource={setRecommendationSource}
            offerProductId={offerProductId} onOfferProductId={setOfferProductId}
            headline={headline} onHeadline={setHeadline}
            discountType={discountType} onDiscountType={setDiscountType}
            discountValue={discountValue} onDiscountValue={setDiscountValue}
            showRating={showRating} onShowRating={setShowRating}
            oneClickAdd={oneClickAdd} onOneClickAdd={setOneClickAdd}
            slotPosition={offerSlotPosition} onSlotPosition={setOfferSlotPosition}
            priority={priority} onPriority={setPriority}
            cooldown={cooldown} onCooldown={setCooldown}
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
        <CartProduct
          showProductImage={showProductImage}
          ctaButtonText={ctaButtonText}
          headline={headline}
          discountType={discountType}
          discountValue={discountValue}
          showRating={showRating}
        />
      </div>
    </div>
  );
}
