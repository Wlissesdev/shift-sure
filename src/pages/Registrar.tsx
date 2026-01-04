import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const HOOPAY_CHECKOUT_URL = 'https://p.hoopay.com.br/v/fa659231-49b9-49b1-ad39-41efb03f88a8';

const registroSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido').max(15),
  localizacao: z.string().min(2, 'Localização é obrigatória').max(100),
  hospital: z.string().min(2, 'Hospital é obrigatório').max(100),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

const Registrar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    localizacao: '',
    hospital: '',
    password: ''
  });

  // Detectar se veio do checkout do Hoopay
  useEffect(() => {
    const referrer = document.referrer;
    const hoopayDomain = 'hoopay.com.br';
    
    // Verificar se está sendo redirecionado do Hoopay (não apenas voltando)
    if (referrer && referrer.includes(hoopayDomain)) {
      setPaymentConfirmed(true);
      toast.success('Pagamento confirmado! Complete seu cadastro.');
    }
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = registroSchema.parse(formData);

      const { error } = await signUp(validated.email, validated.password, {
        nome: validated.nome,
        telefone: validated.telefone,
        localizacao: validated.localizacao,
        hospital: validated.hospital
      });

      if (error) {
        if (error.message?.includes('already registered')) {
          toast.error('Este email já está cadastrado');
        } else {
          toast.error(error.message || 'Erro ao criar conta');
        }
      } else {
        toast.success('Conta criada com sucesso!');
        navigate('/dashboard');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('Erro ao criar conta');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    window.location.href = HOOPAY_CHECKOUT_URL;
  };

  if (!paymentConfirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo variant="full" />
            </div>
            <CardTitle>Acesse a Plataforma</CardTitle>
            <CardDescription>
              Para utilizar o PlantaHoje, é necessário realizar o pagamento único de R$ 29,90
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-accent/50 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-primary mb-2">R$ 29,90</div>
              <p className="text-sm text-muted-foreground">pagamento único</p>
            </div>
            
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                ✓ Acesso completo à plataforma
              </li>
              <li className="flex items-center gap-2">
                ✓ Publique e busque plantões
              </li>
              <li className="flex items-center gap-2">
                ✓ Conecte-se com outros médicos
              </li>
            </ul>
            
            <Button onClick={handlePayment} className="w-full" size="lg">
              Pagar e Continuar
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Já tem conta?{' '}
              <Link to="/entrar" className="text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo variant="full" />
          </div>
          <CardTitle>Criar Conta</CardTitle>
          <CardDescription>
            Preencha seus dados para acessar a plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Dr. João Silva"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="joao@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone (WhatsApp)</Label>
              <Input
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
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
            
            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital Principal</Label>
              <Input
                id="hospital"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                placeholder="Hospital das Clínicas"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Conta'}
            </Button>
          </form>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            Já tem conta?{' '}
            <Link to="/entrar" className="text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Registrar;
