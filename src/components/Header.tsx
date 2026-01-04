import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Calendar, Search } from 'lucide-react';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo variant="full" />
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/buscar">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Search className="h-4 w-4" />
                  Buscar Plantões
                </Button>
              </Link>
              <Link to="/meus-plantoes">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Meus Plantões
                </Button>
              </Link>
              <Link to="/perfil">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Perfil
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link to="/entrar">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link to="/registrar">
                <Button size="sm">Começar</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
