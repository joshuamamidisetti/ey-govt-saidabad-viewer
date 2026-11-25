import type { CSSProperties } from "react";

// Shared styling for the left-side toggle tools (button + flyout panel).

export const toolContainer = (top: number): CSSProperties => ({
        position: "absolute",
        top: `${top}px`,
        left: "10px",
        zIndex: 10,
});

export const toolButton = (active: boolean): CSSProperties => ({
        width: "130px",
        padding: "8px 10px",
        background: active ? "#e8e8e8" : "white",
        border: "1px solid #ccc",
        borderRadius: "6px",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        fontFamily: "Arial",
        fontWeight: 700,
        textAlign: "left",
});

export const toolFlyout: CSSProperties = {
        position: "absolute",
        top: 0,
        left: "140px",
        background: "white",
        padding: "12px",
        borderRadius: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        fontFamily: "Arial",
        width: "180px",
};
