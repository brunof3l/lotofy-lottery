import { createMiddlewareClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Cria uma resposta inicial. O middleware precisa disso para poder manipular os cookies.
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Cria o cliente Supabase que é específico para o ambiente de Middleware.
  // Esta é a correção principal.
  const supabase = createMiddlewareClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  }, {
    request,
    response,
  })

  // Atualiza a sessão do usuário (se expirada) e a guarda nos cookies.
  const { data: { session } } = await supabase.auth.getSession()

  // Lógica de proteção de rotas:
  // Se o usuário não está logado E a rota que ele tenta acessar não é a de login,
  // então redireciona ele para a página de login.
  if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Permite o acesso e devolve a resposta ao navegador com o cookie de sessão atualizado.
  return response
}

export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos de solicitação, exceto os que começam com:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (arquivo de favicon)
     * - / (a página inicial, que deve ser pública)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|$).*)',
  ],
}