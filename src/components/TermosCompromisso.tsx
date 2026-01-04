import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermosCompromissoProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const TermosCompromisso = ({ checked, onCheckedChange }: TermosCompromissoProps) => {
  return (
    <div className="space-y-4">
      <ScrollArea className="h-48 w-full rounded-lg border border-border p-4 bg-muted/50">
        <div className="text-sm text-muted-foreground space-y-4">
          <h4 className="font-semibold text-foreground">TERMOS DE COMPROMISSO E RESPONSABILIDADE</h4>
          
          <p>
            Ao aceitar estes termos, o médico substituto declara e assume integralmente:
          </p>
          
          <ol className="list-decimal pl-4 space-y-2">
            <li>
              <strong>Compromisso de Comparecimento:</strong> Comprometo-me a comparecer ao plantão indicado no horário estipulado, com pontualidade e preparação adequada para exercer as funções médicas necessárias.
            </li>
            
            <li>
              <strong>Responsabilidade Profissional:</strong> Assumo total responsabilidade por todos os atos médicos praticados durante o plantão, incluindo diagnósticos, prescrições, procedimentos e quaisquer outras condutas médicas.
            </li>
            
            <li>
              <strong>Registro Profissional:</strong> Declaro possuir registro ativo e regular no CRM (Conselho Regional de Medicina), estando apto a exercer a medicina de forma legal e ética.
            </li>
            
            <li>
              <strong>Isenção da Plataforma:</strong> Reconheço que a plataforma PlantaHoje atua apenas como intermediadora entre médicos, não possuindo qualquer responsabilidade sobre:
              <ul className="list-disc pl-4 mt-2">
                <li>Atos médicos praticados durante o plantão</li>
                <li>Relações trabalhistas ou contratuais com o hospital</li>
                <li>Eventuais processos judiciais, administrativos ou éticos</li>
                <li>Danos causados a pacientes ou terceiros</li>
                <li>Descumprimento do plantão ou abandono</li>
              </ul>
            </li>
            
            <li>
              <strong>Comunicação com Hospital:</strong> Entendo que a comunicação sobre substituição deve ser feita pelo médico titular ao hospital, sendo esta responsabilidade exclusiva das partes envolvidas.
            </li>
            
            <li>
              <strong>Consequências Legais:</strong> Estou ciente de que o descumprimento deste compromisso pode acarretar:
              <ul className="list-disc pl-4 mt-2">
                <li>Ações judiciais por danos materiais e morais</li>
                <li>Processos éticos no CRM</li>
                <li>Responsabilização criminal, se aplicável</li>
                <li>Suspensão permanente da plataforma</li>
              </ul>
            </li>
          </ol>
          
          <p className="font-semibold mt-4">
            A plataforma PlantaHoje se isenta de qualquer responsabilidade civil, criminal, trabalhista ou ética decorrente da relação entre médicos e hospitais, servindo exclusivamente como meio de conexão entre profissionais.
          </p>
        </div>
      </ScrollArea>
      
      <div className="flex items-start space-x-3">
        <Checkbox 
          id="termos" 
          checked={checked}
          onCheckedChange={(checked) => onCheckedChange(checked === true)}
        />
        <Label htmlFor="termos" className="text-sm leading-relaxed cursor-pointer">
          Li e aceito integralmente os Termos de Compromisso e Responsabilidade acima, compreendendo que assumo total responsabilidade pelos meus atos e que a PlantaHoje está isenta de qualquer complicação decorrente desta substituição.
        </Label>
      </div>
    </div>
  );
};
