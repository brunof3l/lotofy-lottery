import { createMiddlewareClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createMiddlewareClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  }, {
    request,
    response,
  })

  // Atualiza a sessão (essencial para manter o usuário logado)
  await supabase.auth.getSession()

  return response
}

export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos, exceto os que começam com:
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (arquivo de favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}