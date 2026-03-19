import { Link, Outlet, useLocation } from 'react-router-dom';
import { usePageTracking } from '../hooks/usePageTracking';

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
	const { pathname } = useLocation();
	const active = pathname === to;

	return (
		<Link
			to={to}
			className={`text-[0.8rem] tracking-[0.1em] uppercase transition-colors ${
				active ? 'text-fg' : 'text-fg-dim hover:text-fg'
			}`}
		>
			{children}
		</Link>
	);
}

export function Layout() {
	usePageTracking();

	return (
		<div className="max-w-content mx-auto px-8">
			<nav className="py-8 flex justify-between items-center border-b border-border">
				<Link to="/" className="font-mono font-medium text-[0.8rem] tracking-[0.15em] uppercase text-fg">
					Crox
				</Link>
				<div className="flex gap-8">
					<NavLink to="/">Home</NavLink>
					<NavLink to="/about">About</NavLink>
					<NavLink to="/ai-integration">AI Integration</NavLink>
				</div>
			</nav>

			<main id="main">
				<Outlet />
			</main>

			<footer className="border-t border-border py-8 text-[0.7rem] text-fg-dim tracking-[0.05em] flex justify-between">
				<span>© 2026 Crox Ltd</span>
				<span>
					<Link to="/" className="text-fg-dim hover:text-fg transition-colors no-underline">
						crox.io
					</Link>
				</span>
			</footer>
		</div>
	);
}
