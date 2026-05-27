import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import React from "react";
import LogoutButton from "./LogoutButton";




const SignButton = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLogged = !!user;

  if (isLogged)
    return <LogoutButton />

  return (
    <Link
      href="/auth"
      className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-zinc-50 shadow-md shadow-black/20 transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      Sign with GitHub
    </Link>
  );
};


export default SignButton;