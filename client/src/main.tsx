import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import { Layout } from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AiIntegrationPage from './pages/AiIntegrationPage';

// Lazy-load content sections for better initial load
const BlogIndex = lazy(() => import('./pages/blog/BlogIndex'));
const BlogPost = lazy(() => import('./pages/blog/BlogPost'));
const LearnIndex = lazy(() => import('./pages/learn/LearnIndex'));
const LearnPost = lazy(() => import('./pages/learn/LearnPost'));
const ServersIndex = lazy(() => import('./pages/servers/ServersIndex'));

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<HelmetProvider>
			<BrowserRouter>
				<Suspense fallback={<div className="max-w-content mx-auto px-8 py-24 text-fg-dim">Loading…</div>}>
					<Routes>
						<Route element={<Layout />}>
							<Route index element={<HomePage />} />
							<Route path="about" element={<AboutPage />} />
							<Route path="ai-integration" element={<AiIntegrationPage />} />
							<Route path="blog" element={<BlogIndex />} />
							<Route path="blog/:slug" element={<BlogPost />} />
							<Route path="learn" element={<LearnIndex />} />
							<Route path="learn/:slug" element={<LearnPost />} />
							<Route path="servers" element={<ServersIndex />} />
						</Route>
					</Routes>
				</Suspense>
			</BrowserRouter>
		</HelmetProvider>
	</StrictMode>
);
