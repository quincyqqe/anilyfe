'use client';

interface PlayerLoadingProps {
  visible: boolean;
}

export function PlayerLoading({ visible }: PlayerLoadingProps) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div className="relative h-12 w-12 rounded-full border border-white/10 bg-zinc-950/35 backdrop-blur-md">
        <div className="absolute inset-2 rounded-full border-2 border-white/10" />
        <div
          className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-primary"
          style={{ animationDuration: '0.8s' }}
        />
      </div>
    </div>
  );
}
