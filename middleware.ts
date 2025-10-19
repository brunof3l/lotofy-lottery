// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'


 export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Evita falhas quando variáveis de ambiente não estão configuradas
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    // Sem Supabase configurado: segue o fluxo sem autenticação
    return response
  }

  // cria o client do supabase quando envs existem
  const supabase = createServerClient(
    url,
    anon,
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
