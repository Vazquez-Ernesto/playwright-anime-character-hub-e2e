import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from './components/AppShell';

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const CharacterDetailPage = lazy(() =>
  import('./pages/CharacterDetailPage').then((module) => ({ default: module.CharacterDetailPage }))
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'characters/:id', element: <CharacterDetailPage /> },
    ],
  },
]);

export function App() {
  return (
    <Suspense fallback={<div className="panel">Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
