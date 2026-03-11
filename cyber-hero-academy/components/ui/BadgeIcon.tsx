import { cn } from '@/lib/utils';

interface BadgeIconProps {
  icon: string;
  name: string;
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Displays a gamification badge with glow effect when earned.
 */
export default function BadgeIcon({ icon, name, earned = true, size = 'md', className }: BadgeIconProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1.5 group',
        !earned && 'opacity-40 grayscale',
        className
      )}
      title={name}
    >
      <div
        className={cn(
          'rounded-2xl border-2 flex items-center justify-center transition-all duration-300',
          earned
            ? 'border-brand-yellow bg-brand-yellow/10 shadow-lg shadow-brand-yellow/20 group-hover:shadow-brand-yellow/40'
            : 'border-gray-700 bg-white/5',
          size === 'sm' && 'w-10 h-10 text-xl',
          size === 'md' && 'w-14 h-14 text-3xl',
          size === 'lg' && 'w-20 h-20 text-4xl'
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          'text-center font-medium leading-tight',
          earned ? 'text-brand-yellow' : 'text-gray-600',
          size === 'sm' && 'text-xs max-w-[48px]',
          size === 'md' && 'text-xs max-w-[60px]',
          size === 'lg' && 'text-sm max-w-[80px]'
        )}
      >
        {name}
      </span>
    </div>
  );
}
