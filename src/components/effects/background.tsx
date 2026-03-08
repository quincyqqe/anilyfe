import { ParticleCanvas } from './particle-canvas';
import { AccentLines } from './accent-lines';

interface BackgroundProps {
  particles?: boolean;
  gradient?: boolean;
  lines?: boolean;
}

export function Background({ particles = true, gradient = true, lines = false }: BackgroundProps) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {gradient && (
        <div className="absolute inset-0 bg-zinc-950 [background:radial-gradient(80%_60%_at_50%_30%,rgba(255,255,255,0.06),transparent_80%)] before:absolute before:inset-0 before:bg-zinc-950 before:-z-10" />
      )}
      {particles && <ParticleCanvas />}
      {lines && <AccentLines />}
    </div>
  );
}
