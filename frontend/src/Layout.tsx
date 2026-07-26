import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toaster } from 'react-hot-toast';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 relative overflow-hidden">
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed inset-0 bg-radial-glow pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#e2e8f0',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            borderRadius: '12px',
            backdropFilter: 'blur(12px)',
          },
          success: {
            iconTheme: {
              primary: '#22d3ee',
              secondary: '#0f172a',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#0f172a',
            },
          },
        }}
      />
    </div>
  );
}
