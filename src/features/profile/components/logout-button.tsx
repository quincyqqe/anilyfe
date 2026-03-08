'use client';

export function LogoutButton() {
  return (
    <form action="/auth/signout" method="POST">
      <button
        type="submit"
        className="text-sm px-4 h-9 rounded-lg border border-zinc-800 bg-zinc-900 text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors inline-flex items-center"
      >
        Выйти
      </button>
    </form>
  );
}
