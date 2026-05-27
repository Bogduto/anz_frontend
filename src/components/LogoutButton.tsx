"use client";
import { logout } from "@/app/actions";

const LogoutButton = () => {
  return (
    <form action={logout}>
      <button
        type="submit"
        style={{
          fontSize: "13px",
          color: "#F5F0E8",
          padding: "6px 12px",
          borderRadius: "var(--border-radius-md)",
          border: "0.5px solid #F5F0E8",
          cursor: "pointer",
          background: "transparent",
          opacity: 1,
        }}
      >
        Logout
      </button>
    </form>
  );
};

export default LogoutButton;
