import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { usePlantoes } from '@/hooks/usePlantoes';
import { PlantaoCard } from '@/components/PlantaoCard';
import { Search, Plus, Calendar, Users } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { plantoes, meusPlantoes, loading: plantoesLoading } = usePlantoes();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/entrar');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const plantoesDisponiveis = plantoes.filter(p => p.user_id !== user?.id).slice(0, 3);
  const plantoesAtivos = meusPlantoes.filter(p => p.status === 'disponivel' || p.status === 'reservado');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Olá, {profile?.nome?.split(' ')[0] || 'Médico'}!
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo ao PlantaHoje
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/buscar')}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Buscar Plantões</CardTitle>
                <CardDescription>Encontre oportunidades de trabalho</CardDescription>
              </div>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/novo-plantao')}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Anunciar Plantão</CardTitle>
                <CardDescription>Precisa de um substituto? Publique aqui</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Plantões Disponíveis
              </CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{plantoes.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Meus Plantões Ativos
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{plantoesAtivos.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Plantoes */}
        {plantoesDisponiveis.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Plantões Recentes</h2>
              <Link to="/buscar">
                <Button variant="outline" size="sm">Ver todos</Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {plantoesDisponiveis.map(plantao => (
                <PlantaoCard
                  key={plantao.id}
                  plantao={plantao}
                  onCandidatar={() => navigate(`/plantao/${plantao.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <Card className="bg-accent/30 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Lembre-se</h3>
                <p className="text-sm text-muted-foreground">
                  Ao anunciar um plantão, não esqueça de comunicar ao hospital que um substituto irá no seu lugar. 
                  A PlantaHoje é apenas uma plataforma de conexão.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
