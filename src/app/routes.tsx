import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './components/RootLayout';
import { Dashboard } from './pages/Dashboard';
import { Faculty } from './pages/Faculty';
import { Students } from './pages/Students';
import { Subjects } from './pages/Subjects';
import { Payroll } from './pages/Payroll';
import { Records } from './pages/Records';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'subjects', Component: Subjects },
      { path: 'payroll', Component: Payroll },
      { path: 'records', Component: Records },
      { path: 'faculty', Component: Faculty },
      { path: 'students', Component: Students },
    ],
  },
]);
