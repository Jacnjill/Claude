import Link from 'next/link';
import { Shield, Zap, Target, Trophy, ChevronRight, Star } from 'lucide-react';

const missions = [
  {
    icon: '🎣',
    title: 'Phish Frenzy',
    difficulty: 'Beginner',
    desc: 'Identify suspicious emails and stop phishing attacks in their tracks.',
    color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
  },
  {
    icon: '🔐',
    title: 'Password Fortress',
    difficulty: 'Intermediate',
    desc: 'Defend accounts from brute-force attackers with strong passwords and MFA.',
    color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
  },
  {
    icon: '🕵️',
    title: 'The Human Hack',
    difficulty: 'Advanced',
    desc: 'Expose social engineers and protect your team from manipulation tactics.',
    color: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Comic Storytelling',
    desc: 'Learn through cinematic comic panels and characters you actually care about.',
    color: 'text-brand-yellow',
  },
  {
    icon: Target,
    title: 'Mission-Based Learning',
    desc: 'Every lesson is a mission. Tackle real-world threats in immersive scenarios.',
    color: 'text-brand-cyan',
  },
  {
    icon: Trophy,
    title: 'Earn XP & Badges',
    desc: 'Level up your hero rank, collect badges, and prove your cyber expertise.',
    color: 'text-brand-purple',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-brand-darker/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand-purple" />
            <span className="font-bold text-lg text-white">
              Cyber<span className="text-brand-cyan">Hero</span> Academy
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-bold bg-brand-purple hover:bg-brand-violet text-white rounded-xl transition-colors"
            >
              Join Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        {/* Purple glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-violet text-sm font-medium mb-6">
            <Star className="w-3.5 h-3.5 fill-current" />
            Cybersecurity training, reimagined
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-6">
            Learn cyber
            <br />
            <span className="bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-violet bg-clip-text text-transparent">
              like a superhero
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Comic-style stories. Interactive missions. Real threats. Cyber Hero Academy turns
            corporate security training into something you actually want to do.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-purple hover:bg-brand-violet text-white font-bold text-lg rounded-2xl shadow-lg shadow-brand-purple/30 hover:shadow-brand-purple/50 transition-all active:scale-95"
            >
              Join the Academy
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/5 transition-all"
            >
              Sign in
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {['🧑‍💻','👩‍💼','👨‍💻','👩‍🔬'].map((e, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-base">
                  {e}
                </div>
              ))}
            </div>
            <span>Join <strong className="text-white">1,200+</strong> corporate heroes in training</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Training that actually sticks
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Forget boring slide decks. Our approach is built for how Gen-Z professionals actually learn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/20 transition-all group"
              >
                <div className={`mb-4 ${color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Preview Section */}
      <section className="py-20 px-4 bg-mission-gradient border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Your missions await
            </h2>
            <p className="text-gray-400 text-lg">
              Three action-packed modules crafted by security experts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {missions.map(({ icon, title, difficulty, desc, color }) => (
              <div
                key={title}
                className={`relative rounded-2xl border bg-gradient-to-br ${color} p-6 hover:scale-[1.02] transition-transform`}
              >
                <div className="text-4xl mb-4">{icon}</div>
                <div className="inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-white/10 text-gray-300 mb-2">
                  {difficulty}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-6">🛡️</div>
          <h2 className="text-4xl font-black text-white mb-4">
            Ready to become a Cyber Hero?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            It&apos;s free. No credit card required. Start your first mission in under 2 minutes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-4 bg-brand-purple hover:bg-brand-violet text-white font-bold text-lg rounded-2xl shadow-lg shadow-brand-purple/30 transition-all active:scale-95"
          >
            Start Training Free
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-sm text-gray-600">
        <p>© 2026 Cyber Hero Academy. Built to protect the humans behind the machines.</p>
      </footer>
    </div>
  );
}
