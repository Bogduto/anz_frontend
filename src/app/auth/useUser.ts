"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export const useUser = () => {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();
  }, []);

  return user;
};