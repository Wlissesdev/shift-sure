import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Input } from '@/components/ui/input';
import { PlantaoCard } from '@/components/PlantaoCard';
import { useAuth } from '@/hooks/useAuth';
import { usePlantoes } from '@/hooks/usePlantoes';
import { Search } from 'lucide-react';

const BuscarPlantoes = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { plantoes, loading } = usePlantoes();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/entrar');
    }
  }, [user, authLoading, navigate]);

  const plantoesDisponiveis = plantoes.filter(p => 
    p.user_id !== user?.id &&
    (searchTerm === '' || 
      p.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.localizacao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Buscar Plantões</h1>
        <p className="text-muted-foreground mb-6">
          Encontre oportunidades de trabalho perto de você
        </p>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por hospital ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {plantoesDisponiveis.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum plantão encontrado</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Tente buscar com outros termos' : 'Não há plantões disponíveis no momento'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plantoesDisponiveis.map(plantao => (
              <PlantaoCard
                key={plantao.id}
                plantao={plantao}
                onCandidatar={() => navigate(`/plantao/${plantao.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BuscarPlantoes;
