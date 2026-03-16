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

    const targetEmail = "oscarsudi@yahoo.com";
    const targetPassword = "Timba.X0@.";

    // Try to find existing user first
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const existing = users?.users?.find((u) => u.email === targetEmail);

    let userId: string | undefined;

    if (existing) {
      // Update existing user: reset password and confirm email
      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        password: targetPassword,
        email_confirm: true,
      });
      if (updateErr) throw updateErr;
      userId = existing.id;
    } else {
      // Create new admin user
      const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: targetEmail,
        password: targetPassword,
        email_confirm: true,
      });
      if (createError) throw createError;
      userId = user?.user?.id;
    }

    if (!userId) throw new Error("Could not find or create admin user");

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

    if (roleError) throw roleError;

    return new Response(JSON.stringify({ success: true, userId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
