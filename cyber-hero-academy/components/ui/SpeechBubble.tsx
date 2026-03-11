import { cn } from '@/lib/utils';

interface SpeechBubbleProps {
  speaker: string;
  text: string;
  side?: 'left' | 'right';
  variant?: 'hero' | 'villain' | 'narrator';
  className?: string;
}

/**
 * Comic-style speech bubble component.
 * Used in lesson panels to display character dialogue.
 */
export default function SpeechBubble({
  speaker,
  text,
  side = 'left',
  variant = 'hero',
  className,
}: SpeechBubbleProps) {
  const bubbleStyle = {
    hero:     'bg-brand-purple/20 border-brand-purple text-white',
    villain:  'bg-brand-red/20 border-brand-red text-white',
    narrator: 'bg-white/10 border-white/20 text-gray-300 italic',
  }[variant];

  const speakerStyle = {
    hero:     'text-brand-violet',
    villain:  'text-brand-red',
    narrator: 'text-gray-400',
  }[variant];

  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 p-4 max-w-sm',
        bubbleStyle,
        // Tail direction
        side === 'left'  && 'ml-4',
        side === 'right' && 'mr-4',
        className
      )}
    >
      {/* Bubble tail */}
      <div
        className={cn(
          'absolute top-4 w-0 h-0',
          'border-t-[8px] border-t-transparent',
          'border-b-[8px] border-b-transparent',
          side === 'left'  && '-left-4 border-r-[16px] border-r-brand-purple',
          side === 'right' && '-right-4 border-l-[16px] border-l-brand-purple',
          variant === 'villain' && side === 'left'  && 'border-r-brand-red',
          variant === 'villain' && side === 'right' && 'border-l-brand-red',
          variant === 'narrator' && side === 'left'  && 'border-r-white/20',
          variant === 'narrator' && side === 'right' && 'border-l-white/20',
        )}
      />

      <p className={cn('text-xs font-bold uppercase tracking-wider mb-1', speakerStyle)}>
        {speaker}
      </p>
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  );
}
