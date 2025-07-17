import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { supabaseClient } from "@/lib/supabaseClient"; // Optional: if you use a client instance

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id, role, content, timestamp } = req.body;

  if (!user_id || !role || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await supabaseClient
      .from("messages")
      .insert([{ user_id, role, content, timestamp: timestamp || new Date().toISOString() }]);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: "Message saved", data });
  } catch (err: any) {
    console.error("Unexpected error:", err.message);
    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}
