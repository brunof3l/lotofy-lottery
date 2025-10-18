import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    // Retorna um stub amigável que não quebra a UI e informa o erro
    return {
      auth: {
        async signInWithPassword() {
          return { data: null, error: new Error("Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.") }
        },
        async signOut() {
          return { error: null }
        },
        async getUser() {
          return { data: { user: null }, error: new Error("Supabase não configurado.") }
        },
      },
      from() {
        return {
          async select() { return { data: null, error: new Error("Supabase não configurado.") } },
          async insert() { return { data: null, error: new Error("Supabase não configurado.") } },
          async update() { return { data: null, error: new Error("Supabase não configurado.") } },
          async delete() { return { data: null, error: new Error("Supabase não configurado.") } },
        }
      },
    } as any
  }

  return createBrowserClient(url, anonKey)
}

export { createBrowserClient }
