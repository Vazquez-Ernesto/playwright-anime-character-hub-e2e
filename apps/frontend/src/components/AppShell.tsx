import { NavLink, Outlet } from 'react-router-dom';

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">QA Automation Portfolio</p>
          <h1>Anime Character Hub</h1>
        </div>
        <nav className="topbar-nav">
          <NavLink to="/">Dragon Ball Explorer</NavLink>
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
