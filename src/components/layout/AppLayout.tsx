import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '@/components/ui/Toast';
import { useExpenseContext } from '@/context/ExpenseContext';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, dismissToast } = useExpenseContext();

  return (
    <div className="min-h-screen bg-[#6B6659]/10 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 lg:ml-55 min-h-screen flex flex-col">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-10 bg-[#1a1f2e] flex items-center h-14 px-4 gap-3">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="text-white font-semibold text-sm">ExpenseTracker</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-7 lg:p-8 max-w-300 w-full">
          <Outlet />
        </main>
      </div>

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
