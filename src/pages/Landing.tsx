import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { ArrowRight, Shield, Clock, Users, CheckCircle } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <Logo variant="full" />
          <nav className="flex items-center gap-4">
            <Link to="/entrar">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/registrar">
              <Button>Começar Agora</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Conectando médicos para
            <span className="text-primary block">plantões sem estresse</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Precisa de um substituto para seu plantão? Ou quer encontrar oportunidades de trabalho? 
            O PlantaHoje conecta você com outros profissionais de forma rápida e segura.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/registrar">
              <Button size="lg" className="gap-2">
                Criar Conta <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/entrar">
              <Button size="lg" variant="outline">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Como funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-2xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Publique em minutos</h3>
              <p className="text-muted-foreground">
                Não pode fazer um plantão? Publique rapidamente e outros médicos interessados verão sua oportunidade.
              </p>
            </div>
            
            <div className="bg-background p-8 rounded-2xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Encontre substitutos</h3>
              <p className="text-muted-foreground">
                Médicos qualificados se candidatam ao seu plantão. Você escolhe o melhor para o trabalho.
              </p>
            </div>
            
            <div className="bg-background p-8 rounded-2xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Segurança total</h3>
              <p className="text-muted-foreground">
                Termos de compromisso claros e verificação de telefone garantem seriedade de todos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Simples e acessível</h2>
          <p className="text-muted-foreground mb-8">Taxa única de acesso à plataforma</p>
          
          <div className="max-w-md mx-auto bg-background border border-primary/20 rounded-2xl p-8">
            <div className="text-5xl font-bold text-primary mb-2">R$ 29,90</div>
            <p className="text-muted-foreground mb-6">pagamento único</p>
            
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Acesso completo à plataforma
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Publique plantões ilimitados
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Candidate-se a quantos quiser
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Suporte via WhatsApp
              </li>
            </ul>
            
            <Link to="/registrar">
              <Button size="lg" className="w-full">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Info Box */}
      <section className="py-16 bg-accent/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Importante</h3>
            <p className="text-muted-foreground">
              O médico titular deve comunicar ao hospital sobre a substituição. 
              A PlantaHoje é apenas uma plataforma de conexão entre profissionais 
              e não se responsabiliza por questões trabalhistas, éticas ou legais 
              entre as partes envolvidas.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PlantaHoje. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
