
-- Criar tabela de perfis de médicos
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  hospital TEXT NOT NULL,
  telefone_verificado BOOLEAN DEFAULT false,
  payment_confirmed BOOLEAN DEFAULT false,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de plantões disponíveis (médicos precisando de substituto)
CREATE TABLE public.plantoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hospital TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  data_plantao DATE NOT NULL,
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  descricao TEXT,
  valor_sugerido DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'reservado', 'concluido', 'cancelado')),
  substituto_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de candidaturas
CREATE TABLE public.candidaturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plantao_id UUID NOT NULL REFERENCES public.plantoes(id) ON DELETE CASCADE,
  candidato_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mensagem TEXT,
  termos_aceitos BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceito', 'rejeitado')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(plantao_id, candidato_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plantoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidaturas ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "Usuários podem ver todos os perfis" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários podem criar seu próprio perfil" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Policies para plantoes
CREATE POLICY "Qualquer um pode ver plantões disponíveis" ON public.plantoes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários podem criar seus plantões" ON public.plantoes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Donos podem atualizar seus plantões" ON public.plantoes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Donos podem deletar seus plantões" ON public.plantoes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Policies para candidaturas
CREATE POLICY "Donos do plantão e candidatos podem ver candidaturas" ON public.candidaturas
  FOR SELECT TO authenticated 
  USING (
    candidato_id = auth.uid() OR 
    plantao_id IN (SELECT id FROM public.plantoes WHERE user_id = auth.uid())
  );

CREATE POLICY "Usuários podem criar candidaturas" ON public.candidaturas
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = candidato_id);

CREATE POLICY "Donos do plantão podem atualizar candidaturas" ON public.candidaturas
  FOR UPDATE TO authenticated 
  USING (plantao_id IN (SELECT id FROM public.plantoes WHERE user_id = auth.uid()));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plantoes_updated_at
  BEFORE UPDATE ON public.plantoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
