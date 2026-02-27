


import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  List,
  BarChart3,
  Settings,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useSettingsContext } from '@/context/SettingsContext';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/',            icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
  { to: '/add-expense', icon: <PlusCircle size={17} />,      label: 'Add Expense' },
  { to: '/expenses',    icon: <List size={17} />,            label: 'Expenses' },
  { to: '/analytics',   icon: <BarChart3 size={17} />,       label: 'Analytics' },
  { to: '/settings',    icon: <Settings size={17} />,        label: 'Settings' },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { settings } = useSettingsContext();
  const initials = (settings.name || 'JD')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-30 h-full w-55 bg-[#FFFFFF] flex flex-col transition-transform duration-300 border',
        'lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-6">
        <div className="w-8 h-8 rounded-lg bg-linear-to-r from-[#00BC7D] to-[#009689] flex items-center justify-center text-white text-xs font-bold shrink-0">
          ET
        </div>
        <span className="text-gray-900 font-semibold text-[15px]">ExpenseTracker</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-0">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-5 py-2.75 text-sm font-medium border-l-[3px] transition-all duration-150',
                isActive
                  ? 'text-[#007A55] bg-green-100 border-l-[#007A55]' // active nav item
                  : 'text-gray-700 border-l-transparent hover:text-[#007A55] hover:bg-green-50' // default & hover
              )
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 mt-auto border-t border-gray-200 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#8E51FF] to-[#AD46FF] flex items-center justify-center text-white text-xs font-semibold shrink-0">
          {initials}
        </div>
        <div className="overflow-hidden">
          <p className="text-gray-900 text-[13px] font-medium truncate">{settings.name}</p>
          <p className="text-gray-500 text-[11px] truncate">{settings.email}</p>
        </div>
      </div>
    </aside>
  );
}
