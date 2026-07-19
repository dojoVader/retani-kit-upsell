export function ActionRow({ onDiscard , onSave}: { onDiscard?: () => void , onSave?: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", paddingTop: "20px" }}>
      <button
        onClick={onDiscard}
        style={{
          background: "#fff",
          border: "1px solid #c9cccf",
          borderRadius: "6px",
          padding: "8px 16px",
          fontSize: "14px",
          cursor: "pointer",
          color: "#202223",
        }}
      >
        Discard
      </button>
      <button
        onClick={onSave}
        style={{
          background: "#202223",
          border: "none",
          borderRadius: "6px",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          color: "#fff",
        }}
      >
        Save rule
      </button>
    </div>
  );
}
