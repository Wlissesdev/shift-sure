import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  user_id: string;
  nome: string;
  telefone: string;
  localizacao: string;
  hospital: string;
  telefone_verificado: boolean;
  payment_confirmed: boolean;
  payment_date: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Não autenticado' };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (!error) {
      await fetchProfile();
    }

    return { error };
  };

  const confirmPayment = async () => {
    if (!user) return { error: 'Não autenticado' };

    const { error } = await supabase
      .from('profiles')
      .update({ 
        payment_confirmed: true,
        payment_date: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (!error) {
      await fetchProfile();
    }

    return { error };
  };

  return { profile, loading, fetchProfile, updateProfile, confirmPayment };
};
