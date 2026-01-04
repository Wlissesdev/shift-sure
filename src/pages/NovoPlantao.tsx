import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { usePlantoes } from '@/hooks/usePlantoes';
import { toast } from 'sonner';
import { z } from 'zod';
import { AlertTriangle } from 'lucide-react';

const plantaoSchema = z.object({
  hospital: z.string().min(2, 'Hospital é obrigatório').max(100),
  localizacao: z.string().min(2, 'Localização é obrigatória').max(100),
  data_plantao: z.string().min(1, 'Data é obrigatória'),
  horario_inicio: z.string().min(1, 'Horário de início é obrigatório'),
  horario_fim: z.string().min(1, 'Horário de fim é obrigatório'),
  descricao: z.string().max(500).optional(),
  valor_sugerido: z.number().min(0).optional()
});

const NovoPlantao = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile } = useProfile();
  const { criarPlantao } = usePlantoes();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hospital: '',
    localizacao: '',
    data_plantao: '',
    horario_inicio: '',
    horario_fim: '',
    descricao: '',
    valor_sugerido: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/entrar');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        hospital: profile.hospital || '',
        localizacao: profile.localizacao || ''
      }));
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        hospital: formData.hospital,
        localizacao: formData.localizacao,
        data_plantao: formData.data_plantao,
        horario_inicio: formData.horario_inicio,
        horario_fim: formData.horario_fim,
        descricao: formData.descricao || undefined,
        valor_sugerido: formData.valor_sugerido ? parseFloat(formData.valor_sugerido) : undefined
      };

      plantaoSchema.parse(data);

      const { error } = await criarPlantao(data);

      if (error) {
        toast.error('Erro ao criar plantão');
      } else {
        toast.success('Plantão publicado com sucesso!');
        navigate('/meus-plantoes');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('Erro ao criar plantão');
      }
    } finally {
      setLoading(false);
    }
  };

  // Definir data mínima como amanhã
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Publicar Plantão</CardTitle>
            <CardDescription>
              Preencha os detalhes do plantão que você precisa de um substituto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-medium">Importante</p>
                <p className="text-sm text-amber-700">
                  Lembre-se de comunicar ao hospital que você irá enviar um substituto para o plantão.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital</Label>
                  <Input
                    id="hospital"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleChange}
                    placeholder="Nome do hospital"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="localizacao">Cidade/Estado</Label>
                  <Input
                    id="localizacao"
                    name="localizacao"
                    value={formData.localizacao}
                    onChange={handleChange}
                    placeholder="São Paulo, SP"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_plantao">Data do Plantão</Label>
                <Input
                  id="data_plantao"
                  name="data_plantao"
                  type="date"
                  value={formData.data_plantao}
                  onChange={handleChange}
                  min={minDate}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horario_inicio">Horário de Início</Label>
                  <Input
                    id="horario_inicio"
                    name="horario_inicio"
                    type="time"
                    value={formData.horario_inicio}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="horario_fim">Horário de Fim</Label>
                  <Input
                    id="horario_fim"
                    name="horario_fim"
                    type="time"
                    value={formData.horario_fim}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor_sugerido">Valor Sugerido (R$) - Opcional</Label>
                <Input
                  id="valor_sugerido"
                  name="valor_sugerido"
                  type="number"
                  step="0.01"
                  value={formData.valor_sugerido}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição / Observações - Opcional</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Informações adicionais sobre o plantão..."
                  rows={4}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Publicando...' : 'Publicar Plantão'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NovoPlantao;
