import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TermosCompromisso } from '@/components/TermosCompromisso';
import { useAuth } from '@/hooks/useAuth';
import { usePlantoes } from '@/hooks/usePlantoes';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Building2, DollarSign, User, ArrowLeft } from 'lucide-react';

const PlantaoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { candidatar } = usePlantoes();
  
  const [plantao, setPlantao] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [jaCandidatou, setJaCandidatou] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/entrar');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (id && user) {
      fetchPlantao();
      checkCandidatura();
    }
  }, [id, user]);

  const fetchPlantao = async () => {
    const { data, error } = await supabase
      .from('plantoes')
      .select(`
        *,
        profiles:user_id (nome, telefone)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      toast.error('Plantão não encontrado');
      navigate('/buscar');
    } else {
      setPlantao(data);
    }
    setLoading(false);
  };

  const checkCandidatura = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('candidaturas')
      .select('id')
      .eq('plantao_id', id)
      .eq('candidato_id', user.id)
      .maybeSingle();

    setJaCandidatou(!!data);
  };

  const handleCandidatar = async () => {
    if (!termosAceitos) {
      toast.error('Você precisa aceitar os termos de compromisso');
      return;
    }

    setSubmitting(true);
    const { error } = await candidatar(id!, mensagem, termosAceitos);

    if (error) {
      if (typeof error === 'object' && 'code' in error && error.code === '23505') {
        toast.error('Você já se candidatou a este plantão');
      } else {
        toast.error('Erro ao se candidatar');
      }
    } else {
      toast.success('Candidatura enviada com sucesso!');
      setJaCandidatou(true);
    }
    setSubmitting(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!plantao) return null;

  const isOwner = plantao.user_id === user?.id;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-3xl">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Building2 className="h-6 w-6 text-primary" />
                {plantao.hospital}
              </CardTitle>
              <Badge className={
                plantao.status === 'disponivel' ? 'bg-green-100 text-green-800' :
                plantao.status === 'reservado' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }>
                {plantao.status === 'disponivel' ? 'Disponível' :
                 plantao.status === 'reservado' ? 'Reservado' : plantao.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{plantao.localizacao}</span>
              </div>
              
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span>
                  {format(new Date(plantao.data_plantao + 'T00:00:00'), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span>{plantao.horario_inicio.slice(0, 5)} às {plantao.horario_fim.slice(0, 5)}</span>
              </div>
              
              {plantao.valor_sugerido && (
                <div className="flex items-center gap-3 font-medium text-primary">
                  <DollarSign className="h-5 w-5" />
                  <span>R$ {plantao.valor_sugerido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
            </div>

            {plantao.profiles && (
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{plantao.profiles.nome}</p>
                  <p className="text-sm text-muted-foreground">{plantao.profiles.telefone}</p>
                </div>
              </div>
            )}

            {plantao.descricao && (
              <div className="pt-4 border-t border-border">
                <p className="text-muted-foreground">{plantao.descricao}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {!isOwner && plantao.status === 'disponivel' && (
          <Card>
            <CardHeader>
              <CardTitle>Candidatar-se</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {jaCandidatou ? (
                <div className="text-center py-8">
                  <p className="text-lg font-medium text-primary">Você já se candidatou a este plantão</p>
                  <p className="text-muted-foreground">Aguarde o contato do médico responsável</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="mensagem">Mensagem (opcional)</Label>
                    <Textarea
                      id="mensagem"
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      placeholder="Apresente-se brevemente..."
                      rows={3}
                    />
                  </div>

                  <TermosCompromisso
                    checked={termosAceitos}
                    onCheckedChange={setTermosAceitos}
                  />

                  <Button 
                    onClick={handleCandidatar} 
                    className="w-full" 
                    size="lg"
                    disabled={!termosAceitos || submitting}
                  >
                    {submitting ? 'Enviando...' : 'Confirmar Candidatura'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default PlantaoDetalhe;
