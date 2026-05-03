// Supabase Edge Function: Setup Admin User
// Deploy with: supabase functions deploy setup-admin-user

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

interface RequestBody {
  email?: string;
  password?: string;
}

Deno.serve(async (req) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const { email = 'jadtraconsulting@gmail.com', password = 'Admin123!!' }: RequestBody = await req.json()

    // Create Supabase admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Step 1: Check if user exists
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`)
    }

    const existingUser = existingUsers.users.find(u => u.email === email)

    if (existingUser) {
      // Step 3: Update existing user
      const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        {
          password,
          email_confirm: true,
        }
      )

      if (updateError) {
        throw new Error(`Failed to update user: ${updateError.message}`)
      }

      return new Response(
        JSON.stringify({
          success: true,
          action: 'updated',
          user: {
            id: updateData.user.id,
            email: updateData.user.email,
            email_confirmed_at: updateData.user.email_confirmed_at,
          },
          message: 'User exists - password updated',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Step 2: Create new user
    const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createError) {
      throw new Error(`Failed to create user: ${createError.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        action: 'created',
        user: {
          id: createData.user.id,
          email: createData.user.email,
          email_confirmed_at: createData.user.email_confirmed_at,
        },
        message: 'New user created successfully',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
