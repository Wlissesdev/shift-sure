import logoFull from '@/assets/logo-full.jpg';
import logoIcon from '@/assets/logo-icon.jpg';

interface LogoProps {
  variant?: 'full' | 'icon';
  className?: string;
}

export const Logo = ({ variant = 'full', className = '' }: LogoProps) => {
  const src = variant === 'full' ? logoFull : logoIcon;
  
  return (
    <img 
      src={src} 
      alt="PlantaHoje" 
      className={`${variant === 'full' ? 'h-10' : 'h-8'} ${className}`}
    />
  );
};
