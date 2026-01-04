import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Building2, DollarSign, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PlantaoCardProps {
  plantao: {
    id: string;
    hospital: string;
    localizacao: string;
    data_plantao: string;
    horario_inicio: string;
    horario_fim: string;
    descricao: string | null;
    valor_sugerido: number | null;
    status: string;
    profiles?: {
      nome: string;
      telefone: string;
    };
  };
  onCandidatar?: () => void;
  onVerCandidaturas?: () => void;
  onCancelar?: () => void;
  isOwner?: boolean;
  showActions?: boolean;
}

export const PlantaoCard = ({ 
  plantao, 
  onCandidatar, 
  onVerCandidaturas,
  onCancelar, 
  isOwner = false,
  showActions = true 
}: PlantaoCardProps) => {
  const statusColors: Record<string, string> = {
    disponivel: 'bg-green-100 text-green-800',
    reservado: 'bg-blue-100 text-blue-800',
    concluido: 'bg-gray-100 text-gray-800',
    cancelado: 'bg-red-100 text-red-800'
  };

  const statusLabels: Record<string, string> = {
    disponivel: 'Disponível',
    reservado: 'Reservado',
    concluido: 'Concluído',
    cancelado: 'Cancelado'
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {plantao.hospital}
          </CardTitle>
          <Badge className={statusColors[plantao.status]}>
            {statusLabels[plantao.status]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {plantao.localizacao}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {format(new Date(plantao.data_plantao + 'T00:00:00'), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {plantao.horario_inicio.slice(0, 5)} às {plantao.horario_fim.slice(0, 5)}
        </div>
        
        {plantao.valor_sugerido && (
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <DollarSign className="h-4 w-4" />
            R$ {plantao.valor_sugerido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        )}
        
        {plantao.profiles && !isOwner && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            {plantao.profiles.nome}
          </div>
        )}
        
        {plantao.descricao && (
          <p className="text-sm text-muted-foreground border-t border-border pt-3 mt-3">
            {plantao.descricao}
          </p>
        )}
      </CardContent>
      
      {showActions && (
        <CardFooter className="pt-0 gap-2">
          {isOwner ? (
            <>
              {plantao.status === 'disponivel' && (
                <>
                  <Button variant="outline" size="sm" onClick={onVerCandidaturas}>
                    Ver Candidaturas
                  </Button>
                  <Button variant="destructive" size="sm" onClick={onCancelar}>
                    Cancelar
                  </Button>
                </>
              )}
            </>
          ) : (
            plantao.status === 'disponivel' && (
              <Button onClick={onCandidatar} className="w-full">
                Me Candidatar
              </Button>
            )
          )}
        </CardFooter>
      )}
    </Card>
  );
};
