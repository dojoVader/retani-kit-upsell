import { useEffect, useState } from "react";
import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import Upsell from "../intents/Upsell";
import { useAuthenticatedFetch } from "app/utils/useAuthenticatedFetch";
import { BACKEND_ENDPOINTS } from "app/utils/endpoints";



export const loader = async ({ request }: LoaderFunctionArgs) => {

  await authenticate.admin(request);
  return null;
};

type StepInterface = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  actionLabel: string | null;
  actionPrimary: boolean;
}

const initialSteps : StepInterface[] = [
  {
    id: 1,
    title: "Connect to your storefront",
    description: null as string | null,
    completed: true,
    actionLabel: null as string | null,
    actionPrimary: false,
  },
  {
    id: 2,
    title: "Create your first upsell rule",
    description: "Pick a trigger and the product to offer.",
    completed: false,
    actionLabel: "Create rule",
    actionPrimary: true,
  }
];

const initialMetrics = [
  { label: "Upsell revenue", value: null as string | null },
  { label: "AOV lift", value: null as string | null },
  { label: "Offer click rate", value: null as string | null },
  { label: "Upsell conv. rate", value: null as string | null },
];

export default function Index() {

  const shopifyRequest = useAuthenticatedFetch();
  const [steps, setSteps] = useState(initialSteps);
  const [completedCount, setCompleteCount] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [metrics] = useState(initialMetrics);
  const [hasRules] = useState(false);

  useEffect(() => {
    setCompleteCount(steps.filter((s) => s.completed).length);
    setProgressPercent((completedCount / steps.length) * 100)
  },[steps])

  useEffect(() => {
    shopifyRequest(BACKEND_ENDPOINTS.GET_RULES, { method: 'GET' }).then((data) => {
      const { data: dataset } = data;
      if (dataset.length > 0) {
        setSteps(initialSteps.map((item) => ({
          ...item,
          completed: dataset.length
        })))
      }
    });

  },[])



  const markStepComplete = (id: number) => {
    switch(id){
      case 2:
      // Navigate to the Create Rule Interface
      open('/app/upsell', '_self');
      break;
    }
  };



  return (
    // subheading is a valid s-page runtime prop; cast needed because polaris-types omits it
    <s-page {...({ heading: "Dashboard", subheading: "Track the performance of your cart upsells." } as any)}>
      {<Upsell />}
      {/* Empty state card */}
      {!hasRules && (
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #e3e3e3",
            padding: "48px 24px",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: "#ede9fe",
              marginBottom: "16px",
            }}
          >
            <s-icon type="cart-up" tone="info" />
          </div>
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ fontSize: "16px" }}>
              Start earning more from every cart
            </strong>
          </div>
          <p
            style={{
              color: "#6d7175",
              fontSize: "14px",
              maxWidth: "420px",
              margin: "0 auto 24px",
              lineHeight: "1.5",
            }}
          >
            You haven&apos;t shown any upsell offers yet. Create your first rule
            and your revenue, AOV lift, and conversion metrics will appear here.
          </p>
          <s-button-group>
            <s-button  variant="primary">Create your first rule</s-button>
            <s-button variant="secondary">View setup guide</s-button>
          </s-button-group>
        </div>
      )}

      {/* Setup guide card */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e3e3e3",
          padding: "20px 24px",
          marginBottom: "16px",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "4px",
          }}
        >
          <strong style={{ fontSize: "15px" }}>Setup guide</strong>
          <span style={{ fontSize: "13px", color: "#6d7175" }}>
            {completedCount} of {steps.length} complete
          </span>
        </div>
        <p
          style={{
            color: "#6d7175",
            fontSize: "13px",
            margin: "0 0 14px",
          }}
        >
          Finish these steps to go live on your storefront.
        </p>

        {/* Progress bar */}
        <div
          style={{
            height: "4px",
            background: "#e3e3e3",
            borderRadius: "2px",
            marginBottom: "20px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              background: "#1a1a1a",
              borderRadius: "2px",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {steps.map((step, index) => (
            <div key={step.id}>
              {index > 0 && (
                <div
                  style={{
                    height: "1px",
                    background: "#f1f1f1",
                    margin: "0 0",
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 0",
                  gap: "12px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  {/* Step indicator */}
                  {step.completed ? (
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: "#1a1a1a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <s-icon type="check" tone="auto" />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        border: "2px solid #c9cccf",
                        flexShrink: 0,
                      }}
                    />
                  )}

                  {/* Step text */}
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        textDecoration: step.completed
                          ? "line-through"
                          : "none",
                        color: step.completed ? "#8c9196" : "#202223",
                      }}
                    >
                      {step.title}
                    </div>
                    {step.description && (
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#6d7175",
                          marginTop: "2px",
                        }}
                      >
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action button */}
                {step.actionLabel && !step.completed && (
                  <s-button

                    variant={step.actionPrimary ? "primary" : "secondary"}
                    onClick={() => markStepComplete(step.id)}
                  >
                    {step.actionLabel}
                  </s-button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
        }}
      >
        {metrics.map((metric) => (
          <div
            key={metric.label}
            style={{
              background: "#fff",
              borderRadius: "12px",
              border: "1px solid #e3e3e3",
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: "#6d7175",
                marginBottom: "8px",
              }}
            >
              {metric.label}
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#c9cccf",
                marginBottom: "4px",
                lineHeight: "1",
              }}
            >
              &mdash;
            </div>
            <div style={{ fontSize: "12px", color: "#c9cccf" }}>
              {metric.value ?? "No data yet"}
            </div>
          </div>
        ))}
      </div>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
