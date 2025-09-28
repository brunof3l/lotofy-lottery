import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">Conta Criada!</CardTitle>
              <CardDescription>Verifique seu email para confirmar</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Você se cadastrou com sucesso! Verifique sua caixa de entrada e clique no link de confirmação para
                ativar sua conta.
              </p>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Não recebeu o email?</p>
                <p className="text-xs text-muted-foreground">Verifique sua pasta de spam ou lixo eletrônico.</p>
              </div>
              <Button asChild className="w-full">
                <Link href="/auth/login">Voltar para Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
