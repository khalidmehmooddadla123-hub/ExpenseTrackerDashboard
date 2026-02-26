import  { useState } from 'react';
import { Download, Trash2, User, Bell, Database } from 'lucide-react';
import { useSettingsContext } from '@/context/SettingsContext';
import { useExpenseContext } from '@/context/ExpenseContext';
import { storageService } from '@/services/storageService';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { exportToCSV } from '@/utils/helpers';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettingsContext();
  const { expenses } = useExpenseContext();

  const [profile, setProfile] = useState({
    name: settings.name,
    email: settings.email,
  });
  const [budget, setBudget] = useState(String(settings.budget));
  const [profileSaved, setProfileSaved] = useState(false);
  const [budgetSaved, setBudgetSaved] = useState(false);

  const saveProfile = () => {
    updateSettings({ name: profile.name, email: profile.email });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const saveBudget = () => {
    updateSettings({ budget: Number(budget) || 0 });
    setBudgetSaved(true);
    setTimeout(() => setBudgetSaved(false), 2000);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure? This will permanently delete all expenses and cannot be undone.')) {
      storageService.clearExpenses();
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="max-w-160 space-y-5 ">
        {/* Profile */}
        <Card>
          <div className="flex items-center gap-2 mb-4 ">
            <User size={16} className="text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-800">Profile Information</h2>
          </div>
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div className="mt-4 ">
            <Button onClick={saveProfile} size="sm" variant='advance'>
              {profileSaved ? '✓ Saved!' : 'Save Changes'}
            </Button>
          </div>
        </Card>

        {/* Budget */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">💰</span>
            <h2 className="text-sm font-semibold text-slate-800">Monthly Budget</h2>
          </div>
          <Input
            label="Budget Amount"
            type="number"
            min="0"
            step="100"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            leftIcon={<span className="text-sm">$</span>}
          />
          <div className="mt-4">
            <Button onClick={saveBudget} size="sm" variant='advance'>
              {budgetSaved ? '✓ Updated!' : 'Update Budget'}
            </Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Bell size={16} className="text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-800">Notifications</h2>
          </div>
          <Toggle
            checked={settings.budgetAlerts}
            onChange={(v) => updateSettings({ budgetAlerts: v })}
            label="Budget Alerts"
            description="Get notified when you exceed your budget"
          />
          <Toggle
            checked={settings.expenseReminders}
            onChange={(v) => updateSettings({ expenseReminders: v })}
            label="Expense Reminders"
            description="Daily reminder to log your expenses"
          />
          <Toggle
            checked={settings.monthlyReports}
            onChange={(v) => updateSettings({ monthlyReports: v })}
            label="Monthly Reports"
            description="Receive monthly spending summary"
          />
        </Card>

        {/* Data Management */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Database size={16} className="text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-800">Data Management</h2>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-700">Export Data</p>
                <p className="text-xs text-slate-400 mt-0.5">Download all expenses as CSV</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => exportToCSV(expenses)}
              >
                <Download size={13} />
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-700">Clear All Data</p>
                <p className="text-xs text-red-400 mt-0.5">Permanently delete all expenses</p>
              </div>
              <Button variant="danger" size="sm" onClick={handleClearAll}>
                <Trash2 size={13} />
                Clear Data
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
