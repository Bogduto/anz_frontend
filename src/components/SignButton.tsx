import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const SignButton = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const initials = (user.user_metadata?.user_name as string ?? user.email ?? "?")
      .slice(0, 2)
      .toUpperCase();

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#F5F0E8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 500,
            color: "#1C1917",
            flexShrink: 0,
          }}
          title={user.email ?? ""}
        >
          {initials}
        </div>
        <LogoutButton />
      </div>
    );
  }

  return (
    <Link
      href="/auth"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        fontSize: "13px",
        fontWeight: 500,
        padding: "7px 14px",
        borderRadius: "var(--border-radius-md)",
        background: "#F5F0E8",
        color: "#1C1917",
        textDecoration: "none",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#1C1917" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
      Sign in with GitHub
    </Link>
  );
};

export default SignButton;
