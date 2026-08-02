import { useState } from "react";
import { FieldRow, TabButton, ActionRow } from "./elements";
import { CartReturning } from "./cart-type/CartReturning";
import { useAuthenticatedFetch } from "./../utils/useAuthenticatedFetch";
import { BACKEND_ENDPOINTS } from "app/utils/endpoints";

type Tab = "trigger" | "offer" | "appearance";

interface TriggerTabProps {
  minPastOrders: string; onMinPastOrders: (v: string) => void;
  excludeAlreadyPurchased: boolean; onExcludeAlreadyPurchased: (v: boolean) => void;
  maxDaysSinceLastOrder: string; onMaxDaysSinceLastOrder: (v: string) => void;
  priority: string; onPriority: (v: string) => void;
  cooldown: string; onCooldown: (v: string) => void;
}

function TriggerTab({
  minPastOrders, onMinPastOrders,
  excludeAlreadyPurchased, onExcludeAlreadyPurchased,
  maxDaysSinceLastOrder, onMaxDaysSinceLastOrder,
  priority, onPriority,
  cooldown, onCooldown,
}: TriggerTabProps) {
  return (
    <div>
      <FieldRow
        name="minPastOrders"
        badge="required"
        description="Customer must have at least N past orders"
        control={
          <input
            type="number"
            value={minPastOrders}
            min={1}
            onChange={(e) => onMinPastOrders(e.target.value)}
            style={{ width: "70px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", textAlign: "right" }}
          />
        }
      />
      <FieldRow
        name="requiresLogin"
        badge="required"
        description="Order history needs an authenticated session"
        control={
          <s-switch
            label="requiresLogin"
            label-accessibility-visibility="hidden"
            checked={true}
            disabled={true}
          />
        }
      />
      <FieldRow
        name="excludeAlreadyPurchased"
        badge="optional"
        description="Suppress if customer owns the offer product"
        control={
          <s-switch
            label="excludeAlreadyPurchased"
            label-accessibility-visibility="hidden"
            checked={excludeAlreadyPurchased}
            onChange={(e: any) => onExcludeAlreadyPurchased(e.target.checked)}
          />
        }
      />
      <FieldRow
        name="maxDaysSinceLastOrder"
        badge="optional"
        description="Only fire if last order was within N days"
        control={
          <input
            type="number"
            value={maxDaysSinceLastOrder}
            min={0}
            onChange={(e) => onMaxDaysSinceLastOrder(e.target.value)}
            style={{ width: "70px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", textAlign: "right" }}
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
    </div>
  );
}

interface OfferTabProps {
  recommendationSource: string; onRecommendationSource: (v: string) => void;
  offerProductId: string; onOfferProductId: (v: string) => void;
  headline: string; onHeadline: (v: string) => void;
  discountType: string; onDiscountType: (v: string) => void;
  discountValue: string; onDiscountValue: (v: string) => void;
  oneClickAdd: boolean; onOneClickAdd: (v: boolean) => void;
}

function OfferTab({
  recommendationSource, onRecommendationSource,
  offerProductId, onOfferProductId,
  headline, onHeadline,
  discountType, onDiscountType,
  discountValue, onDiscountValue,
  oneClickAdd, onOneClickAdd,
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
            <option value="new-since-last-visit">New since last visit</option>
            <option value="top-picks">Top picks</option>
            <option value="manual">Manual pick</option>
          </select>
        }
      />
      <FieldRow
        name="offerProductId"
        badge="optional"
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
        name="oneClickAdd"
        badge="optional"
        control={
          <s-switch
            label="oneClickAdd"
            label-accessibility-visibility="hidden"
            checked={oneClickAdd}
            onChange={(e: any) => onOneClickAdd(e.target.checked)}
          />
        }
      />
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
    </div>
  );
}

export default function ReturningRule() {
  const shopifyFetch = useAuthenticatedFetch();
  const [activeTab, setActiveTab] = useState<Tab>("trigger");

  // Trigger
  const [minPastOrders, setMinPastOrders] = useState("2");
  const [excludeAlreadyPurchased, setExcludeAlreadyPurchased] = useState(true);
  const [maxDaysSinceLastOrder, setMaxDaysSinceLastOrder] = useState("");
  const [priority, setPriority] = useState("10");
  const [cooldown, setCooldown] = useState("session");

  // Offer
  const [recommendationSource, setRecommendationSource] = useState("new-since-last-visit");
  const [offerProductId, setOfferProductId] = useState("");
  const [headline, setHeadline] = useState("New since your last visit");
  const [discountType, setDiscountType] = useState("none");
  const [discountValue, setDiscountValue] = useState("0");
  const [oneClickAdd, setOneClickAdd] = useState(true);

  // Appearance
  const [ctaButtonText, setCtaButtonText] = useState("Buy again");
  const [slotPosition, setSlotPosition] = useState("below-cart-items");
  const [showProductImage, setShowProductImage] = useState(true);
  const [showStarRatings, setShowStarRatings] = useState(false);

  const submitRules = async () => {
    try {
      await shopifyFetch(BACKEND_ENDPOINTS.SAVE_RULES, {
        method: "POST",
        body: JSON.stringify({
          type: "returning",
          config: {
            minPastOrders,
            excludeAlreadyPurchased,
            maxDaysSinceLastOrder,
            priority,
            cooldown,
            recommendationSource,
            offerProductId,
            headline,
            discountType,
            discountValue,
            oneClickAdd,
            ctaButtonText,
            slotPosition,
            showProductImage,
            showStarRatings,
          },
        }),
      });
      shopify.toast.show("Returning buyer rule saved");
      open("/app", "_self");
    } catch {
      shopify.toast.show("Failed to save returning buyer rule", { isError: true });
    }
  };

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
            minPastOrders={minPastOrders} onMinPastOrders={setMinPastOrders}
            excludeAlreadyPurchased={excludeAlreadyPurchased} onExcludeAlreadyPurchased={setExcludeAlreadyPurchased}
            maxDaysSinceLastOrder={maxDaysSinceLastOrder} onMaxDaysSinceLastOrder={setMaxDaysSinceLastOrder}
            priority={priority} onPriority={setPriority}
            cooldown={cooldown} onCooldown={setCooldown}
          />
        )}
        {activeTab === "offer" && (
          <OfferTab
            recommendationSource={recommendationSource} onRecommendationSource={setRecommendationSource}
            offerProductId={offerProductId} onOfferProductId={setOfferProductId}
            headline={headline} onHeadline={setHeadline}
            discountType={discountType} onDiscountType={setDiscountType}
            discountValue={discountValue} onDiscountValue={setDiscountValue}
            oneClickAdd={oneClickAdd} onOneClickAdd={setOneClickAdd}
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

        <ActionRow onSave={() => submitRules()} />
      </div>

      <div style={{ position: "sticky", top: "16px" }}>
        <CartReturning
          showProductImage={showProductImage}
          ctaButtonText={ctaButtonText}
          headline={headline}
          discountType={discountType}
          discountValue={discountValue}
        />
      </div>
    </div>
  );
}
