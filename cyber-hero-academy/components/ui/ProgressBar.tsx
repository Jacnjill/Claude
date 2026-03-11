import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;       // 0–100
  label?: string;
  showPercent?: boolean;
  color?: 'purple' | 'cyan' | 'green' | 'yellow';
  size?: 'sm' | 'md';
  className?: string;
}

export default function ProgressBar({
  value,
  label,
  showPercent = true,
  color = 'purple',
  size = 'md',
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  const trackColor = {
    purple: 'from-brand-purple to-brand-violet',
    cyan:   'from-brand-cyan to-teal-400',
    green:  'from-brand-green to-emerald-400',
    yellow: 'from-brand-yellow to-orange-400',
  }[color];

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showPercent && (
            <span className="text-sm font-bold text-white">{clampedValue}%</span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-white/10 overflow-hidden',
          size === 'sm' ? 'h-2' : 'h-3'
        )}
      >
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out',
            trackColor
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
