import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BarChart3, TrendingUp, Target, Users, Brain, Shield, Star, Play, ArrowRight, Menu } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">Lotofy</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Recursos
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Como Funciona
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Depoimentos
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
                <Link href="/auth/login">Entrar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/sign-up">
                  <span className="hidden sm:inline">Começar</span>
                  <span className="sm:hidden">Entrar</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 sm:mb-8 bg-primary/10 text-primary border-primary/20">
              <TrendingUp className="mr-2 h-3 w-3" />
              <span className="text-xs sm:text-sm">Análise Estatística Avançada</span>
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl text-balance leading-[1.1]">
              Previsões inteligentes para a <span className="text-primary">Lotofácil</span>
            </h1>
            <p className="mt-6 sm:mt-8 text-lg sm:text-xl leading-relaxed text-muted-foreground text-pretty max-w-3xl mx-auto px-4 sm:px-0">
              Use o poder da análise estatística e inteligência artificial para fazer previsões mais assertivas na
              Lotofácil. Baseado em dados históricos e padrões matemáticos.
            </p>
            <div className="mt-8 sm:mt-12 flex items-center justify-center gap-3 sm:gap-4 flex-col sm:flex-row px-4 sm:px-0">
              <Button size="lg" className="h-12 px-6 sm:px-8 w-full sm:w-auto" asChild>
                <Link href="/auth/sign-up">
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-6 sm:px-8 w-full sm:w-auto bg-transparent" asChild>
                <Link href="#how-it-works">
                  <Play className="mr-2 h-4 w-4" />
                  Ver Como Funciona
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Preview */}
          <div className="mx-auto mt-16 sm:mt-20 max-w-5xl px-4 sm:px-0">
            <Card className="bg-card/50 backdrop-blur border-border/50 shadow-2xl">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                <div className="grid grid-cols-1 gap-8 sm:gap-12 sm:grid-cols-3">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">85%</div>
                    <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                      Taxa de Acerto
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">10.000+</div>
                    <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                      Jogos Analisados
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">5.000+</div>
                    <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
                      Usuários Ativos
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
              Recursos Poderosos para Suas Previsões
            </h2>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-muted-foreground text-pretty">
              Ferramentas avançadas baseadas em ciência de dados para maximizar suas chances de sucesso.
            </p>
          </div>

          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Análise Estatística</CardTitle>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    Análise profunda de frequência, padrões e tendências dos números sorteados.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">IA Preditiva</CardTitle>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    Algoritmos de machine learning treinados com milhares de resultados históricos.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Números Quentes/Frios</CardTitle>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    Identifique números com alta e baixa frequência de sorteio em tempo real.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Previsões Personalizadas</CardTitle>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    Gere jogos baseados em seus padrões preferidos e estratégias personalizadas.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Histórico Completo</CardTitle>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    Acesso a todos os resultados históricos da Lotofácil com análises detalhadas.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Dados Seguros</CardTitle>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    Seus dados e estratégias são protegidos com criptografia de nível bancário.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-muted/20 py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
              Como Funciona o Lotofy
            </h2>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-muted-foreground text-pretty">
              Três passos simples para começar a fazer previsões inteligentes.
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 gap-12 sm:gap-16 lg:grid-cols-3">
              <div className="text-center group">
                <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl sm:text-2xl font-bold mb-6 sm:mb-8 group-hover:scale-105 transition-transform">
                  1
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">Cadastre-se</h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Crie sua conta em segundos e tenha acesso imediato às análises básicas.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl sm:text-2xl font-bold mb-6 sm:mb-8 group-hover:scale-105 transition-transform">
                  2
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">Analise os Dados</h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Explore estatísticas, padrões e tendências dos números da Lotofácil.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl sm:text-2xl font-bold mb-6 sm:mb-8 group-hover:scale-105 transition-transform">
                  3
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">Gere Previsões</h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Use nossa IA para gerar jogos otimizados baseados em análise estatística.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
              O que nossos usuários dizem
            </h2>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-muted-foreground text-pretty">
              Milhares de pessoas já estão usando o Lotofy para melhorar suas estratégias.
            </p>
          </div>

          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    "Desde que comecei a usar o Lotofy, minha taxa de acerto aumentou significativamente. As análises
                    são muito precisas!"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">MR</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Maria Rosa</p>
                      <p className="text-sm text-muted-foreground">São Paulo, SP</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    "A interface é muito intuitiva e as previsões são baseadas em dados reais. Recomendo para todos!"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">JS</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">João Silva</p>
                      <p className="text-sm text-muted-foreground">Rio de Janeiro, RJ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 sm:col-span-2 lg:col-span-1">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    "Finalmente encontrei uma ferramenta que realmente funciona. Os padrões identificados são
                    impressionantes!"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">AC</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Ana Costa</p>
                      <p className="text-sm text-muted-foreground">Belo Horizonte, MG</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
              Pronto para Aumentar Suas Chances?
            </h2>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-muted-foreground text-pretty">
              Junte-se a milhares de usuários que já estão usando dados para jogar de forma mais inteligente.
            </p>
            <div className="mt-8 sm:mt-12 flex items-center justify-center gap-3 sm:gap-4 flex-col sm:flex-row px-4 sm:px-0">
              <Button size="lg" className="h-12 px-6 sm:px-8 w-full sm:w-auto" asChild>
                <Link href="/auth/sign-up">
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-6 sm:px-8 w-full sm:w-auto bg-transparent" asChild>
                <Link href="/auth/login">Já Tenho Conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-muted/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 gap-8 sm:gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xl font-bold text-foreground tracking-tight">Lotofy</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Previsões inteligentes para a Lotofácil baseadas em análise estatística e inteligência artificial.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Produto</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                    Como Funciona
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                    Preços
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-muted-foreground hover:text-foreground transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                    Carreiras
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Suporte</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    Termos
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="text-muted-foreground hover:text-foreground transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/20 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © 2025 Lotofy. Previsões baseadas em análise estatística. Jogue com responsabilidade.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="https://twitter.com/lotofy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link
                href="https://instagram.com/lotofy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="https://linkedin.com/company/lotofy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
