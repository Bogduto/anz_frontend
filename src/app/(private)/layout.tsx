import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/landing");
  }

  return <>{children}</>;
};

export default layout;

