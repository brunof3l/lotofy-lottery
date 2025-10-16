// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Se variáveis de ambiente não estiverem presentes, não executar lógica de sessão
  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  // cria o client do supabase
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set(name, value, options)
        },
        remove(name: string, options: any) {
          response.cookies.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  // exemplo: checar sessão do usuário
  const { data: { session } } = await supabase.auth.getSession()

  // se não tiver sessão, pode redirecionar (opcional)
  // if (!session) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  return response
}

export const config = {
  matcher: [
    // aplica o middleware em todas as rotas, exceto estáticos e favicon
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
