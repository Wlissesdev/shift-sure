import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlantaoCard } from '@/components/PlantaoCard';
import { useAuth } from '@/hooks/useAuth';
import { usePlantoes } from '@/hooks/usePlantoes';
import { Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const MeusPlantoes = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { meusPlantoes, loading, cancelarPlantao, buscarCandidaturas, aceitarCandidatura, fetchMeusPlantoes } = usePlantoes();
  
  const [candidaturasDialog, setCandidaturasDialog] = useState<string | null>(null);
  const [candidaturas, setCandidaturas] = useState<any[]>([]);
  const [loadingCandidaturas, setLoadingCandidaturas] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/entrar');
    }
  }, [user, authLoading, navigate]);

  const handleVerCandidaturas = async (plantaoId: string) => {
    setLoadingCandidaturas(true);
    setCandidaturasDialog(plantaoId);
    const data = await buscarCandidaturas(plantaoId);
    setCandidaturas(data);
    setLoadingCandidaturas(false);
  };

  const handleAceitarCandidatura = async (candidatura: any) => {
    const { error } = await aceitarCandidatura(
      candidatura.id,
      candidatura.plantao_id,
      candidatura.candidato_id
    );

    if (error) {
      toast.error('Erro ao aceitar candidatura');
    } else {
      toast.success('Candidatura aceita! O médico será notificado.');
      setCandidaturasDialog(null);
    }
  };

  const handleCancelar = async (plantaoId: string) => {
    if (confirm('Tem certeza que deseja cancelar este plantão?')) {
      const { error } = await cancelarPlantao(plantaoId);
      if (error) {
        toast.error('Erro ao cancelar plantão');
      } else {
        toast.success('Plantão cancelado');
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const disponiveis = meusPlantoes.filter(p => p.status === 'disponivel');
  const reservados = meusPlantoes.filter(p => p.status === 'reservado');
  const finalizados = meusPlantoes.filter(p => p.status === 'concluido' || p.status === 'cancelado');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Meus Plantões</h1>
            <p className="text-muted-foreground">
              Gerencie os plantões que você está oferecendo
            </p>
          </div>
          <Link to="/novo-plantao">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Plantão
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="disponiveis">
          <TabsList className="mb-6">
            <TabsTrigger value="disponiveis">
              Disponíveis ({disponiveis.length})
            </TabsTrigger>
            <TabsTrigger value="reservados">
              Reservados ({reservados.length})
            </TabsTrigger>
            <TabsTrigger value="finalizados">
              Finalizados ({finalizados.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="disponiveis">
            {disponiveis.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum plantão disponível</h3>
                <p className="text-muted-foreground mb-4">
                  Você ainda não publicou nenhum plantão
                </p>
                <Link to="/novo-plantao">
                  <Button>Publicar Plantão</Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {disponiveis.map(plantao => (
                  <PlantaoCard
                    key={plantao.id}
                    plantao={plantao}
                    isOwner
                    onVerCandidaturas={() => handleVerCandidaturas(plantao.id)}
                    onCancelar={() => handleCancelar(plantao.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reservados">
            {reservados.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Nenhum plantão reservado</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reservados.map(plantao => (
                  <PlantaoCard
                    key={plantao.id}
                    plantao={plantao}
                    isOwner
                    showActions={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="finalizados">
            {finalizados.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Nenhum plantão finalizado</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {finalizados.map(plantao => (
                  <PlantaoCard
                    key={plantao.id}
                    plantao={plantao}
                    isOwner
                    showActions={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialog de Candidaturas */}
        <Dialog open={!!candidaturasDialog} onOpenChange={() => setCandidaturasDialog(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Candidaturas</DialogTitle>
            </DialogHeader>
            
            {loadingCandidaturas ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : candidaturas.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Ainda não há candidaturas para este plantão
              </p>
            ) : (
              <div className="space-y-4">
                {candidaturas.map(candidatura => (
                  <div key={candidatura.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{candidatura.profiles?.nome}</p>
                        <p className="text-sm text-muted-foreground">{candidatura.profiles?.hospital}</p>
                        <p className="text-sm text-muted-foreground">{candidatura.profiles?.telefone}</p>
                        {candidatura.mensagem && (
                          <p className="text-sm mt-2 bg-muted p-2 rounded">
                            "{candidatura.mensagem}"
                          </p>
                        )}
                      </div>
                      {candidatura.status === 'pendente' && (
                        <Button size="sm" onClick={() => handleAceitarCandidatura(candidatura)}>
                          Aceitar
                        </Button>
                      )}
                      {candidatura.status === 'aceito' && (
                        <span className="text-sm text-green-600 font-medium">Aceito</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default MeusPlantoes;
