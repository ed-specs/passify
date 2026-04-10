export default function Loading({ name }) {
  return (
    <div className="flex items-center justify-center min-h-dvh bg-white/50 z-50">
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-2xl font-bold">Passify</h2>

        <span className="text-gray-500 animate-pulse text-sm">
          Loading {name}...
        </span>
      </div>
    </div>
  );
}
