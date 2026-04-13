export function MyTeamsError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="mt-4 rounded-md border border-white/15 bg-white/8 px-3 py-2 text-sm text-white/80"
    >
      {message}
    </p>
  );
}
