import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Navbar />
      {/* Offset content below fixed navbar */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
