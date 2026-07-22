import { MapPin, Compass, Mountain, Sun } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left — Travel Visual */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-orange-600 items-center justify-center">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-[30rem] h-[30rem] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-[35rem] h-[35rem] bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-fuchsia-300/10 rounded-full blur-2xl" />

        {/* Decorative travel icons */}
        <Compass className="absolute top-16 right-20 w-16 h-16 text-white/10 rotate-12" />
        <MapPin className="absolute bottom-24 left-16 w-12 h-12 text-white/10" />
        <Sun className="absolute top-1/2 left-12 w-10 h-10 text-amber-200/20" />
        <Mountain className="absolute bottom-32 right-24 w-20 h-20 text-white/5" />

        {/* Content */}
        <div className="relative z-10 text-center px-14">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-8 border border-white/20">
            <span className="text-2xl font-bold text-white">BH</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
            Weekends were<br />made for this.
          </h2>
          <p className="text-lg text-white/70 leading-relaxed max-w-sm mx-auto">
            Friday night depart. Monday morning return. Zero leaves needed — just pure adventure.
          </p>
          <div className="mt-10 flex justify-center gap-2">
            {['🏔️', '🏖️', '🌲', '🏕️'].map((emoji, i) => (
              <span key={i} className="text-xl opacity-60 hover:opacity-100 transition-opacity">{emoji}</span>
            ))}
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/40 to-transparent" />
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 bg-gradient-to-br from-gray-50 to-white relative overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-900/5 border border-white/80 p-8 lg:p-10">
            {children}
          </div>
        </div>
        <p className="mt-8 text-xs text-gray-400 text-center">
          By continuing, you agree to our{' '}
          <a href="/terms" className="text-primary-600 hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
