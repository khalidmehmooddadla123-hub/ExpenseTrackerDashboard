import  { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ExpenseProvider } from '@/context/ExpenseContext'
import { SettingsProvider } from '@/context/SettingsContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoadingScreen } from '@/components/ui/Spinner'

// Lazy load pages for code splitting
const DashboardPage  = lazy(() => import('@/pages/DashboardPage'))
const AddExpensePage = lazy(() => import('@/pages/AddExpensePage'))
const ExpensesPage   = lazy(() => import('@/pages/ExpensesPage'))
const AnalyticsPage  = lazy(() => import('@/pages/AnalyticsPage'))
const SettingsPage   = lazy(() => import('@/pages/SettingsPage'))

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <ExpenseProvider>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/"            element={<DashboardPage />} />
                <Route path="/add-expense" element={<AddExpensePage />} />
                <Route path="/expenses"    element={<ExpensesPage />} />
                <Route path="/analytics"   element={<AnalyticsPage />} />
                <Route path="/settings"    element={<SettingsPage />} />
              </Route>
            </Routes>
          </Suspense>
        </ExpenseProvider>
      </SettingsProvider>
    </BrowserRouter>
  )
}
