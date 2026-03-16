import { Anime } from '@/shared/types/anime';

type Member = Anime['members'][number];

const ROLE_LABELS: Record<string, string> = {
  voicing: 'Озвучка',
  translating: 'Перевод',
  timing: 'Тайминг',
  decorating: 'Оформление',
};

interface Props {
  members: Anime['members'];
}

export function AnimeTeam({ members }: Props) {
  const grouped = members.reduce<Record<string, Member[]>>((acc, m) => {
    const key = m.role?.value;
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  const roles = Object.keys(grouped).filter((r) => ROLE_LABELS[r]);
  if (!roles.length) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-zinc-600">
        Команда
      </span>
      <div className="flex flex-col gap-2">
        {roles.map((role) => (
          <div key={role} className="flex flex-col gap-0.5">
            <span className="text-[11px] text-zinc-600">{ROLE_LABELS[role]}</span>
            <span className="text-xs text-zinc-400">
              {grouped[role].map((m) => m.nickname).join(', ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
