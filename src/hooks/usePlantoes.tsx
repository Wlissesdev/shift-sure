import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Plantao {
  id: string;
  user_id: string;
  hospital: string;
  localizacao: string;
  data_plantao: string;
  horario_inicio: string;
  horario_fim: string;
  descricao: string | null;
  valor_sugerido: number | null;
  status: string;
  substituto_id: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    nome: string;
    telefone: string;
  } | null;
}

interface Candidatura {
  id: string;
  plantao_id: string;
  candidato_id: string;
  mensagem: string | null;
  termos_aceitos: boolean;
  status: string;
  created_at: string;
  profiles?: {
    nome: string;
    telefone: string;
    hospital: string;
  } | null;
}

export const usePlantoes = () => {
  const { user } = useAuth();
  const [plantoes, setPlantoes] = useState<Plantao[]>([]);
  const [meusPlantoes, setMeusPlantoes] = useState<Plantao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPlantoes();
      fetchMeusPlantoes();
    }
  }, [user]);

  const fetchPlantoes = async () => {
    const { data, error } = await supabase
      .from('plantoes')
      .select('*')
      .eq('status', 'disponivel')
      .gte('data_plantao', new Date().toISOString().split('T')[0])
      .order('data_plantao', { ascending: true });

    if (error) {
      console.error('Erro ao buscar plantões:', error);
    } else {
      // Buscar perfis separadamente
      const plantoesWithProfiles: Plantao[] = [];
      for (const plantao of data || []) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('nome, telefone')
          .eq('user_id', plantao.user_id)
          .maybeSingle();
        
        plantoesWithProfiles.push({
          ...plantao,
          profiles: profileData
        });
      }
      setPlantoes(plantoesWithProfiles);
    }
    setLoading(false);
  };

  const fetchMeusPlantoes = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('plantoes')
      .select('*')
      .eq('user_id', user.id)
      .order('data_plantao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar meus plantões:', error);
    } else {
      setMeusPlantoes(data || []);
    }
  };

  const criarPlantao = async (plantao: {
    hospital: string;
    localizacao: string;
    data_plantao: string;
    horario_inicio: string;
    horario_fim: string;
    descricao?: string;
    valor_sugerido?: number;
  }) => {
    if (!user) return { error: 'Não autenticado' };

    const { error } = await supabase
      .from('plantoes')
      .insert({
        ...plantao,
        user_id: user.id
      });

    if (!error) {
      await fetchPlantoes();
      await fetchMeusPlantoes();
    }

    return { error };
  };

  const cancelarPlantao = async (plantaoId: string) => {
    const { error } = await supabase
      .from('plantoes')
      .update({ status: 'cancelado' })
      .eq('id', plantaoId);

    if (!error) {
      await fetchPlantoes();
      await fetchMeusPlantoes();
    }

    return { error };
  };

  const candidatar = async (plantaoId: string, mensagem: string, termosAceitos: boolean) => {
    if (!user) return { error: 'Não autenticado' };

    const { error } = await supabase
      .from('candidaturas')
      .insert({
        plantao_id: plantaoId,
        candidato_id: user.id,
        mensagem,
        termos_aceitos: termosAceitos
      });

    return { error };
  };

  const buscarCandidaturas = async (plantaoId: string): Promise<Candidatura[]> => {
    const { data, error } = await supabase
      .from('candidaturas')
      .select('*')
      .eq('plantao_id', plantaoId);

    if (error) {
      console.error('Erro ao buscar candidaturas:', error);
      return [];
    }

    // Buscar perfis separadamente
    const candidaturasWithProfiles: Candidatura[] = [];
    for (const candidatura of data || []) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('nome, telefone, hospital')
        .eq('user_id', candidatura.candidato_id)
        .maybeSingle();
      
      candidaturasWithProfiles.push({
        ...candidatura,
        profiles: profileData
      });
    }

    return candidaturasWithProfiles;
  };

  const aceitarCandidatura = async (candidaturaId: string, plantaoId: string, candidatoId: string) => {
    // Atualizar candidatura para aceita
    await supabase
      .from('candidaturas')
      .update({ status: 'aceito' })
      .eq('id', candidaturaId);

    // Rejeitar outras candidaturas
    await supabase
      .from('candidaturas')
      .update({ status: 'rejeitado' })
      .eq('plantao_id', plantaoId)
      .neq('id', candidaturaId);

    // Atualizar plantão
    const { error } = await supabase
      .from('plantoes')
      .update({ 
        status: 'reservado',
        substituto_id: candidatoId
      })
      .eq('id', plantaoId);

    if (!error) {
      await fetchPlantoes();
      await fetchMeusPlantoes();
    }

    return { error };
  };

  return { 
    plantoes, 
    meusPlantoes, 
    loading, 
    fetchPlantoes, 
    fetchMeusPlantoes,
    criarPlantao, 
    cancelarPlantao, 
    candidatar,
    buscarCandidaturas,
    aceitarCandidatura
  };
};
