

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://hhkhdylytivsnzwfczuw.supabase.co";
const supabaseKey = "sb_publishable_3CEVoTBocnsVUnk4IQ7K_g_P9Fn4gN4";
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase env variables missing");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // هذا يمنع تراكم sessions متعارضة
    //: "motherhood-auth",
    storageKey: "motherhood-auth-v2",
   //lock: "motherhood-auth-v2",
    // ← يمنع تعارض الـ locks بين instances متعددة
    flowType: "pkce",


  },
});

