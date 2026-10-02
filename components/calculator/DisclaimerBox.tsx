import { AlertTriangle } from 'lucide-react';
import { PROFESSIONAL_ADVICE_NOTICE } from '@/lib/config/disclaimers';

interface DisclaimerBoxProps {
  text?: string;
}

export function DisclaimerBox({ text }: DisclaimerBoxProps) {
  return (
    <div className="bg-cream-2 border border-ink/15 p-4 flex gap-3">
      <AlertTriangle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold mb-1.5">כתב ויתור</p>
        <p className="text-sm text-ink/70 leading-relaxed">{PROFESSIONAL_ADVICE_NOTICE}</p>
        {text && <p className="mt-2 text-sm text-ink/70 leading-relaxed">{text}</p>}
      </div>
    </div>
  );
}
