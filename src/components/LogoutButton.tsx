"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/landing");
  };

  return (
    <button
      className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-zinc-50 shadow-md shadow-black/20 transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
