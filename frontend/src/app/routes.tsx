import { createBrowserRouter } from 'react-router-dom';
import IndexPage from '../pages/IndexPage';
import DashboardPage from '../pages/DashboardPage';
import ResultsSinglePage from '../pages/ResultsSinglePage';
import ResultsABPage from '../pages/ResultsABPage';
import LogsSinglePage from '../pages/LogsSinglePage';
import LogsABPage from '../pages/LogsABPage';

export const router = createBrowserRouter([
  { path: '/', element: <IndexPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/results/single', element: <ResultsSinglePage /> },
  { path: '/results/ab', element: <ResultsABPage /> },
  { path: '/logs/single', element: <LogsSinglePage /> },
  { path: '/logs/ab', element: <LogsABPage /> },
]);
