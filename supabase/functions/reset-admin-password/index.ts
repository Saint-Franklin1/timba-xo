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
    // Verify the caller is an authenticated admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verify caller is admin
    const callerClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        auth: { autoRefreshToken: false, persistSession: false },
        global: { headers: { Authorization: authHeader } },
      }
    );

    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action } = body;

    if (action === "setup-admin") {
      // One-time setup: reset password and confirm email for target user
      const targetEmail = "jamielockins1@gmail.com";
      const newPassword = "Timba.X0@.";

      // Find the user
      const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
      const targetUser = userList?.users?.find((u) => u.email === targetEmail);

      if (!targetUser) {
        // Create the user if not found
        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: targetEmail,
          password: newPassword,
          email_confirm: true,
        });
        if (createErr) throw createErr;

        // Assign admin role
        await supabaseAdmin.from("user_roles").upsert(
          { user_id: created.user.id, role: "admin" },
          { onConflict: "user_id,role" }
        );

        return new Response(JSON.stringify({ success: true, message: "Admin user created and confirmed" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update existing user
      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
        password: newPassword,
        email_confirm: true,
      });
      if (updateErr) throw updateErr;

      // Ensure admin role
      await supabaseAdmin.from("user_roles").upsert(
        { user_id: targetUser.id, role: "admin" },
        { onConflict: "user_id,role" }
      );

      return new Response(JSON.stringify({ success: true, message: "Password reset and email confirmed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "change-password") {
      const { currentPassword, newPassword } = body;

      if (!currentPassword || !newPassword) {
        return new Response(JSON.stringify({ error: "Current and new password required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate new password
      if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        return new Response(JSON.stringify({ error: "Password must be at least 8 characters with one uppercase letter and one number" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify current password by attempting sign-in
      const { error: signInErr } = await supabaseAdmin.auth.signInWithPassword({
        email: caller.email!,
        password: currentPassword,
      });

      if (signInErr) {
        return new Response(JSON.stringify({ error: "Current password is incorrect" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update password using admin API
      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(caller.id, {
        password: newPassword,
      });

      if (updateErr) throw updateErr;

      return new Response(JSON.stringify({ success: true, message: "Password updated successfully" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
