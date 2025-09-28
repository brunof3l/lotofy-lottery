import { createMiddlewareClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Cria uma resposta inicial. O middleware precisa disso para manipular os cookies.
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Cria o cliente Supabase específico para o ambiente de Middleware.
  // Este é o ponto crucial da correção.
  const supabase = createMiddlewareClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  }, {
    request,
    response,
  })

  // Pega a sessão para manter o usuário logado.
  const { data: { session } } = await supabase.auth.getSession()

  // Se o usuário não está logado e não está tentando acessar a página de login,
  // redireciona ele para a página de login.
  if (!session && request.nextUrl.pathname !== '/auth/login') {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Retorna a resposta, que agora contém os cookies de sessão atualizados.
  return response
}

export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos de solicitação, exceto para os que começam com:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (arquivo de favicon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}