import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const admins = [
      { email: "oscarsudi@yahoo.com", password: "Timba.X0@." },
      { email: "jamielockins1@gmail.com", password: "Timba.X0@." },
    ];

    const results = [];

    for (const admin of admins) {
      const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
      const existing = userList?.users?.find((u) => u.email === admin.email);

      let userId: string | undefined;

      if (existing) {
        const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
          password: admin.password,
          email_confirm: true,
        });
        if (updateErr) throw updateErr;
        userId = existing.id;
      } else {
        const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: admin.email,
          password: admin.password,
          email_confirm: true,
        });
        if (createError) throw createError;
        userId = user?.user?.id;
      }

      if (!userId) throw new Error("Could not find or create admin: " + admin.email);

      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

      if (roleError) throw roleError;
      results.push({ email: admin.email, userId });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
