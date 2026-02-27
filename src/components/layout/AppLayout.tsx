import  { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '@/components/ui/Toast';
import { useExpenseContext } from '@/context/ExpenseContext';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, dismissToast } = useExpenseContext();

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Dark backdrop overlay when mobile sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left sidebar — fixed, slides in/out on mobile */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Right side — everything that is NOT the sidebar */}
      {/* min-w-0 is critical: it tells the flex child to allow shrinking below its content size */}
      <div className="flex-1 lg:ml-55 min-h-screen flex flex-col min-w-0">

        {/* ── Mobile top bar (hidden on lg+) ── */}
        <header className="lg:hidden sticky top-0 z-10 bg-white border-b border-slate-200 flex items-center h-12 px-3 gap-3 shadow-sm shrink-0">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded bg-primary-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              ET
            </div>
            <span className="text-slate-800 font-semibold text-sm truncate">ExpenseTracker</span>
          </div>
        </header>

        {/* ── Main page content ── */}
        {/* overflow-x-hidden prevents any child from creating a horizontal scrollbar */}
        <main className="flex-1 overflow-x-hidden">
          <div className="p-3 sm:p-5 lg:p-8 max-w-300 w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
