import type { ReactNode } from "react";

const badgeStyle: Record<string, React.CSSProperties> = {
  required: { background: "#fff0f0", color: "#d72c0d", border: "1px solid #f9c0b7" },
  optional: { background: "#f1f8f5", color: "#008060", border: "1px solid #b3d9cc" },
  pro: { background: "#f4f0ff", color: "#6b47d6", border: "1px solid #d2c0f9" },
};

export function FieldRow({
  name,
  badge,
  description,
  control,
}: {
  name: string;
  badge: "required" | "optional" | "pro";
  description?: string;
  control: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
        borderBottom: "1px solid #f1f1f1",
        gap: "16px",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "monospace", fontWeight: "600", fontSize: "14px", color: "#202223" }}>
            {name}
          </span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "500",
              padding: "1px 7px",
              borderRadius: "20px",
              ...badgeStyle[badge],
            }}
          >
            {badge}
          </span>
        </div>
        {description && (
          <div style={{ fontSize: "12px", color: "#6d7175", marginTop: "3px" }}>{description}</div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{control}</div>
    </div>
  );
}
