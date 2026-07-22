import { Compass, Sparkles } from 'lucide-react';

export function Loader({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-fuchsia-600 shadow-lg shadow-primary-200">
          <Compass className="h-7 w-7 text-white animate-spin" style={{ animationDirection: 'reverse' }} />
        </div>
        <div className="absolute -inset-1 -z-10 animate-ping rounded-2xl bg-primary-400/30" />
      </div>
      <p className="text-sm font-medium text-gray-500">{text}</p>
    </div>
  );
}

export function PageLoader({ text = 'Loading your adventure…' }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-fuchsia-50">
      {/* Purple gradient orbs */}
      <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-primary-200/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-fuchsia-200/30 blur-3xl" />

      <div className="relative mb-8">
        {/* Outer ring */}
        <div className="absolute -inset-4 animate-spin rounded-full border-2 border-dashed border-primary-300/40" style={{ animationDuration: '8s' }} />
        {/* Inner ring */}
        <div className="absolute -inset-2 animate-spin rounded-full border-2 border-dashed border-fuchsia-300/30" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
        {/* Center icon */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-600 to-fuchsia-700 shadow-xl shadow-primary-300/40">
          <Compass className="h-10 w-10 text-white" style={{ animation: 'spin 2s linear infinite' }} />
        </div>
        <div className="absolute -inset-1 -z-10 animate-ping rounded-3xl bg-primary-400/20" />
      </div>

      <p className="text-xl font-bold text-gray-800">{text}</p>

      {/* Purple progress dots */}
      <div className="mt-6 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor: i % 2 === 0 ? '#9333ea' : '#c084fc',
              animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Bottom tagline */}
      <p className="absolute bottom-8 text-xs text-gray-400">Weekends were made for this.</p>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
