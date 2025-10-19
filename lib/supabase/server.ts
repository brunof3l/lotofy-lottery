// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    // Stub amigável para ambiente sem Supabase configurado
    return {
      auth: {
        async getUser() {
          return { data: { user: null }, error: new Error('Supabase não configurado.') }
        },
        async signOut() { return { error: null } },
      },
      from() {
        return {
          async select() { return { data: null, error: new Error('Supabase não configurado.') } },
          async insert() { return { data: null, error: new Error('Supabase não configurado.') } },
          async update() { return { data: null, error: new Error('Supabase não configurado.') } },
          async delete() { return { data: null, error: new Error('Supabase não configurado.') } },
        }
      }
    } as ReturnType<typeof createServerClient>
  }

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}